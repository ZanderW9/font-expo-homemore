import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { Dialog } from "@rneui/themed";
import * as Linking from "expo-linking";
import * as Updates from "expo-updates";
import { createClient } from "graphql-ws";
import { Platform } from "react-native";
import { showMessage } from "react-native-flash-message";

import { View, Text } from "@/components/Themed";
import { updateAppMeta } from "@/config/state/appMetaSlice";
import { store } from "@/config/state/store";
import { removeLocalItem } from "@/config/storageManager";

const dialogComponent = (
  <View
    style={{
      alignItems: "center",
    }}
  >
    <Text
      style={{
        textAlign: "center",
        padding: 5,
        paddingBottom: 20,
        fontWeight: "bold",
        fontSize: 16,
      }}
    >
      A New Version is Available
    </Text>

    <Text
      style={{
        textAlign: "center",
        padding: 5,
      }}
    >
      Thank you for using Homemore!
    </Text>
    <Text style={{ textAlign: "center", padding: 5 }}>
      A new version of our app is available now with new features and
      improvements.{" "}
    </Text>
    <Text
      style={{
        textAlign: "center",
        padding: 5,
        paddingBottom: 20,
      }}
    >
      Please update to the latest version to enjoy the best experience.
    </Text>
    <Dialog.Button
      title="OPEN APP STORE"
      onPress={() => Linking.openURL("https://apps.apple.com/app/6477903880")}
    />
  </View>
);

/*
 * 添加错误处理链接
 * 1. 处理后端返回的错误信息 danger, info
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map((error) => {
      if (error.message.startsWith("danger:")) {
        const message = error.message.replace(/^danger:/, "");
        showMessage({
          message,
          icon: "danger",
          type: "danger",
        });

        // 如果错误信息为 "danger:Invalid user"，则重新加载 app
        if (message === "Invalid User") {
          (async () => {
            await removeLocalItem("token");
            await removeLocalItem("user");
            Updates.reloadAsync();
          })();
        }
      } else if (error.message.startsWith("info:")) {
        const message = error.message.replace(/^info:/, "");

        switch (message) {
          case "App New Hotfix":
            showMessage({
              message: "Update Available",
              description: "App is being updated",
              type: "info",
            });
            Updates.checkForUpdateAsync();
            break;

          case "App New Version":
            if (Platform.OS === "ios") {
              store.dispatch(
                updateAppMeta({
                  openDialog: true,
                  dialogComponent,
                }),
              );
            }
            break;

          default:
            showMessage({
              message,
              icon: "info",
              type: "info",
              duration: 3000,
            });
            break;
        }
      }
    });
  }

  if (networkError) {
    // 处理网络错误
    showMessage({
      message: "Network error",
      icon: "info",
      type: "info",
    });
  }
});

/*
 * 从后往前检查 incoming list。
 * 当找到存在于当前 cache 中的数据时停下，只保留这个数据之后的部分
 * 避免分页时数据重复
 */
const offsetFromCursor = (merged, incoming, readField) => {
  const mergedIds = merged.map((item) => readField("id", item));
  for (let i = incoming.length - 1; i >= 0; --i) {
    const item = incoming[i];
    if (mergedIds.includes(readField("id", item))) {
      return i + 1;
    }
  }
  return 0;
};

export const createApolloLink = (token: string | null = null) => {
  const httpLinkUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  // header 中添加 token 以及 app 版本信息
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        app_version: Updates.runtimeVersion,
        update_id: Updates.updateId,
        channel: Updates.channel,
        platform: Platform.OS,
      },
    };
  });
  const httpLink = new HttpLink({
    uri: `${httpLinkUrl}/graphql`,
  });

  const wsLinkUrl = httpLinkUrl ? httpLinkUrl.replace("http", "ws") : "";

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${wsLinkUrl}/graphql`,
      connectionParams: {
        Authorization: token,
      },
    }),
  );

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink,
  );
  return from([errorLink, authLink, splitLink]);
};

export const createApolloClient = (token: string | null = null) => {
  const apolloLink = createApolloLink(token);

  return new ApolloClient({
    link: apolloLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allListings: {
              keyArgs: false,
              merge(existing, incoming, { args, readField }) {
                const merged = existing || [];
                const offset = offsetFromCursor(merged, incoming, readField);

                if (offset >= incoming.length) return merged;

                const newIncoming = incoming.slice(offset);
                const newMerged = [...merged, ...newIncoming];
                return newMerged;
              },
            },
            searchListings: {
              keyArgs: false,
              merge(existing, incoming, { args, readField }) {
                const merged = existing ? existing.slice(0) : [];
                const offset = offsetFromCursor(merged, incoming, readField);
                if (offset >= incoming.length) return merged;
                const newmerged = [...merged, ...incoming.slice(offset)];
                return newmerged;
              },
            },
          },
        },
      },
    }),
  });
};
