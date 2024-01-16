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
import { CHAT_QUERY, CHAT_SUBSCRIPTION } from "@config/gql/chat";
import useUserLocation from "@config/hooks/useUserLocation";
import { getLocalItem } from "@config/storageManager";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
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

export const GlobalContext = React.createContext({});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [httpLinkUrl] = useState(process.env.EXPO_PUBLIC_BACKEND_URL);
  const [client, setClient] = useState(null);

  const setApolloClient = (token, httpLinkUrl) => {
    setClient(createApolloClient(token, httpLinkUrl));
  };

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
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
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
        <RootLayoutNav />
      </ApolloProvider>
    </GlobalContext.Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useUserLocation();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
