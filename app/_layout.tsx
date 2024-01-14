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
import { CHAT_QUERY, CHAT_SUBSCRIPTION } from "@config/gql/chat";
import useUserLocation from "@config/hooks/useUserLocation";
import { fetchDynamicUrl } from "@config/s3";
import { getLocalItem } from "@config/storageManager";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { createClient } from "graphql-ws";
import React, { useEffect, useState } from "react";
import { useColorScheme, Platform } from "react-native";
import FlashMessage from "react-native-flash-message";

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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

export const GlobalContext = React.createContext({});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = await getLocalItem("userToken");
  // Return the headers to the context so HTTP link can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

function offsetFromCursor(merged, incoming, readField) {
  const mergedIds = merged.map((item) => readField("id", item));
  for (let i = incoming.length - 1; i >= 0; --i) {
    const item = incoming[i];
    if (mergedIds.includes(readField("id", item))) {
      return i + 1;
    }
  }
  return 0;
}

const createApolloClient = (httpLink) => {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allListings: {
              keyArgs: true,
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

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useUserLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [httpLinkUrl, setHttpLinkUrl] = useState(
    process.env.EXPO_PUBLIC_BACKEND_URL,
  );

  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const token = await getLocalItem("userToken");
      setToken(token);
    };
    getToken();
  }, []);
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

  useEffect(() => {
    // use to get dynamic url for development
    const fetch = async () => {
      const data = await fetchDynamicUrl();
      setHttpLinkUrl(data.url);
    };
    if (
      process.env.EXPO_PUBLIC_DEVELOPER !== "production" &&
      process.env.EXPO_PUBLIC_DEVELOPER !== "staging"
    ) {
      fetch();
    }
  }, []);

  const client = createApolloClient(splitLink);

  return (
    <ApolloProvider client={client}>
      <GlobalContext.Provider
        value={{ isLoggedIn, setIsLoggedIn, httpLinkUrl, token }}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen
                name="search"
                options={{
                  presentation: "modal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="addwishlist"
                options={{
                  presentation: "transparentModal",
                  animation: "none",
                  headerShown: false,
                  animationDuration: 100,
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
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GlobalContext.Provider>
    </ApolloProvider>
  );
}

export const ChatContext = React.createContext({});

export const ChatProvider = ({ children }) => {
  const client = useApolloClient();
  const { data, loading } = useSubscription(CHAT_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data) {
        const newMessage = data.data.newMessage;
        const chatId = newMessage.chat.id;
        // Read the current query result from the cache
        const existingChats = client.readQuery({
          query: CHAT_QUERY,
          variables: {
            chatId,
          },
        });
        if (existingChats) {
          // Update the cache with the new message
          client.writeQuery({
            query: CHAT_QUERY,
            variables: {},
            data: {
              ...existingChats,
              me: {
                ...existingChats.me,
                chats: updateChatsWithNewMessage(
                  existingChats.me.chats,
                  newMessage,
                ),
              },
            },
          });
        }
      }
    },
  });

  return (
    <ChatContext.Provider
      value={{
        data,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const updateChatsWithNewMessage = (chats, newMessage) => {
  const chatId = newMessage.chatId;

  return chats.map((chatOnUser) => {
    if (chatOnUser.id === chatId) {
      const messageExists = chatOnUser.chat.messages.some(
        (message) => message._id === newMessage.id,
      );

      if (!messageExists) {
        newMessage._id = newMessage.id;
        newMessage.user._id = newMessage.user.id;
        return {
          ...chatOnUser,
          chat: {
            ...chatOnUser.chat,
            messages: [...chatOnUser.chat.messages, newMessage],
          }, // Append new message
        };
      }
    }
    return chatOnUser;
  });
};
