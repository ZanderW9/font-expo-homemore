import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
  useSubscription,
  useApolloClient,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import CustomSplashScreen from "@components/CustomSplashScreen";
import SearchProvider from "@components/search/SearchProvider";
import {
  CHAT_QUERY,
  CHAT_SUBSCRIPTION,
  updateChatsWithNewMessage,
} from "@config/gql/chat";
import { useLocation } from "@config/hooks/location";
import { getLocalItem } from "@config/storageManager";
import { useThemedColors } from "@constants/theme";
import { useApolloClientDevTools } from "@dev-plugins/apollo-client";
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as Font from "expo-font";
import { useNavigationContainerRef, SplashScreen, Stack } from "expo-router";
import { createClient } from "graphql-ws";
import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider } from "react-native-outside-press";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
// import { requestLocationPermissions } from "@config/backgroundTasks";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

const createApolloClient = (token: string, httpLinkUrl: string) => {
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
  return new ApolloClient({
    link: authLink.concat(splitLink),
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

export const GlobalContext = React.createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  token: null,
  setToken: () => {},
  httpLinkUrl: "",
  client: null,
  setApolloClient: () => {},
});

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  useAsyncStorageDevTools();
  const colors = useThemedColors();

  const [appIsReady, setAppIsReady] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [httpLinkUrl] = useState(process.env.EXPO_PUBLIC_BACKEND_URL);
  const [client, setClient] = useState(null);
  const [splashImageUri, setSplashImageUri] = useState("");
  const setApolloClient = (token: string, httpLinkUrl: string) => {
    setClient(createApolloClient(token, httpLinkUrl));
  };

  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animation.value,
      transform: [{ scale: interpolate(animation.value, [0, 1], [2, 1]) }],
    };
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          SpaceMono: require("@assets/fonts/SpaceMono-Regular.ttf"),
          ...FontAwesome.font,
        });
        const token = await getLocalItem("userToken");
        if (token) {
          setIsLoggedIn(true);
        }
        setToken(token);

        setApolloClient(token, httpLinkUrl);
        const [{ localUri }] = await Asset.loadAsync(
          require("@assets/images/splash.png"),
        );
        setSplashImageUri(localUri);
      } catch {
        // do nothing
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
      animation.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(setAnimationComplete)(true);
      });
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <CustomSplashScreen />;
  }

  return (
    <GlobalContext.Provider
      value={{
        httpLinkUrl,
        token,
        setToken,
        isLoggedIn,
        setIsLoggedIn,
        client,
        setApolloClient,
      }}
    >
      <ApolloProvider client={client}>
        <View style={{ flex: 1 }}>
          <RootLayoutNav />
          {!isSplashAnimationComplete && (
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor:
                    colors.back2 ||
                    Constants.expoConfig?.splash?.backgroundColor,
                },
                animatedStyle,
              ]}
            >
              <Animated.Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode:
                    Constants.expoConfig?.splash?.resizeMode || "contain",
                }}
                source={{ uri: splashImageUri }}
                fadeDuration={0}
              />
            </Animated.View>
          )}
        </View>
      </ApolloProvider>
    </GlobalContext.Provider>
  );
}

export const ChatContext = React.createContext({});

export const ChatProvider = ({ children }) => {
  const client = useApolloClient();
  const { loading } = useSubscription(CHAT_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data) {
        const newMessage = data.data.newMessage;
        const existingData = client.readQuery({
          query: CHAT_QUERY,
        });
        if (existingData) {
          // Update the cache with the new message
          client.writeQuery({
            query: CHAT_QUERY,
            data: {
              allChats: updateChatsWithNewMessage(existingData, newMessage),
              me: existingData.me,
            },
          });
        }
      }
    },
  });

  return (
    <ChatContext.Provider
      value={{
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

function RootLayoutNav() {
  useLocation();
  const client = useApolloClient();
  useApolloClientDevTools(client);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ChatProvider>
          <SearchProvider>
            <EventProvider>
              <AutocompleteDropdownContextProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Screen
                    name="search"
                    options={{
                      animation: "slide_from_right",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="search-result"
                    options={{
                      animation: "slide_from_right",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="createwishlist"
                    options={{
                      presentation: "transparentModal",
                      animation: "slide_from_bottom",
                      headerShown: false,
                      animationDuration: 100,
                    }}
                  />
                  <Stack.Screen
                    name="map"
                    options={{
                      presentation: "transparentModal",
                      animation: "slide_from_bottom",
                      headerShown: false,
                      animationDuration: 100,
                    }}
                  />
                  <Stack.Screen
                    name="detailMap"
                    options={{
                      presentation: "transparentModal",
                      animation: "slide_from_bottom",
                      headerShown: false,
                      animationDuration: 100,
                    }}
                  />
                </Stack>
                <FlashMessage
                  position="top"
                  floating
                  statusBarHeight={Platform.OS === "ios" ? null : 35}
                />
              </AutocompleteDropdownContextProvider>
            </EventProvider>
          </SearchProvider>
        </ChatProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
