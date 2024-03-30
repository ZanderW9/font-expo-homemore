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
import { createClient } from "graphql-ws";
import { showMessage } from "react-native-flash-message";

import { signOut } from "@/config/state/appMetaSlice";
import { store } from "@/config/state/store";
import { removeLocalItem } from "@/config/storageManager";

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

        // 如果错误信息为 "danger:Invalid user"，则登出
        if (message === "Invalid user") {
          store.dispatch(signOut());
          removeLocalItem("token");
          removeLocalItem("user");
        }
      } else if (error.message.startsWith("info:")) {
        const message = error.message.replace(/^info:/, "");
        showMessage({
          message,
          icon: "info",
          type: "info",
        });
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
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
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
              merge(existing, incoming, { args, readField }) {
                const merged = existing ? existing.slice(0) : [];
                const offset = offsetFromCursor(merged, incoming, readField);
                if (offset >= incoming.length) return merged;

                const newmerged = [...merged, ...incoming.slice(offset)];
                return newmerged;
              },
              // 读取所有数据
              read(existing, { args, readField }) {
                if (existing && Array.isArray(existing)) {
                  return existing;
                }
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
