import { useQuery, gql, ApolloProvider } from "@apollo/client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Font from "expo-font";
import * as Localization from "expo-localization";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import React, { ReactNode, useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { Provider as ReduxProvider } from "react-redux";

import { createApolloClient } from "@/components/ApolloClient";
import {
  registerForPushNotificationsAsync,
  useNotificationObserver,
} from "@/config/notification";
import useFetch from "@/config/restfulApi";
import { updateAppMeta } from "@/config/state/appMetaSlice";
import {
  useDispatch,
  store,
  useSelector,
  RootState,
} from "@/config/state/store";
import {
  getLocalItems,
  storeLocalItem,
  removeLocalItem,
} from "@/config/storageManager";

SplashScreen.preventAutoHideAsync().catch(() => {});

const VALIDATE_USER_QUERY = gql`
  query Query {
    me {
      id
      userName
      avatar
      createdAt
    }
  }
`;

const AppLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.appMeta);

  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdateAvailable) {
      showMessage({
        message: "Update Available",
        description: "App is being updated",
        type: "info",
      });
      Updates.fetchUpdateAsync();
    }

    if (isUpdatePending) {
      showMessage({
        message: "Update Downloaded",
        description: "App is being reloaded",
        type: "info",
      });

      Updates.reloadAsync();
    }
  }, [isUpdatePending, isUpdateAvailable]);

  // 获取用户 push token 并更新到后端
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );
  }, []);

  const dispatch = useDispatch();
  const { fetchFunc: updatePushToken } = useFetch();

  useEffect(() => {
    async function sendPushToken() {
      if (expoPushToken) {
        updatePushToken(
          process.env.EXPO_PUBLIC_BACKEND_URL + "/api/updateUserPushToken",
          "POST",
          {
            expoPushToken,
          },
          token,
        );
      }
    }

    sendPushToken();
  }, [expoPushToken, token]);

  // App打开时请求用户信息
  const { data } = useQuery(VALIDATE_USER_QUERY);
  useEffect(() => {
    async function validateUser() {
      if (data?.me?.id) {
        await storeLocalItem("user", data?.me);
        dispatch(updateAppMeta({ user: data?.me }));
      } else if (data?.me.id === "") {
        await removeLocalItem("user");
        dispatch(updateAppMeta({ user: null }));
      }
    }
    validateUser();
  }, [data, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    /*
     *读取本地存储的token, user, locale 等...
     *读取字体, 图片等资源
     *设置app的宽度
     */
    async function prepare() {
      const { token, user, locale, width } = await getLocalItems([
        "token",
        "user",
        "locale",
        "width",
      ]);

      let appLocale = locale;
      if (!appLocale) {
        appLocale = Localization.getLocales()[0].languageCode;
        if (appLocale !== "zh" && appLocale !== "en") {
          appLocale = "en";
        }
        await storeLocalItem("locale", appLocale);
      }

      dispatch(updateAppMeta({ token, user, locale: appLocale, width }));

      /* 加载字体 */
      await Font.loadAsync({
        SpaceMono: require("@assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
      });
    }
    prepare();

    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      dispatch(updateAppMeta({ width: window.width }));
    });
    return () => subscription?.remove();
  }, []);

  return <View style={{ flex: 1 }}>{children}</View>;
};

const ApolloLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useSelector((state: RootState) => state.appMeta);
  const [client, setClient] = useState(createApolloClient(token));

  useEffect(() => {
    setClient(createApolloClient(token));
  }, [token]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

const GlobalLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  useNotificationObserver();
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <GlobalLoader>
      <ApolloLoader>
        <AppLoader>{children}</AppLoader>
      </ApolloLoader>
    </GlobalLoader>
  );
}
