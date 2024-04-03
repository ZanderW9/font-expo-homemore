import { useSubscription, useApolloClient } from "@apollo/client";
import SearchProvider from "@components/search/SearchProvider";
import {
  CHAT_QUERY,
  CHAT_SUBSCRIPTION,
  updateChatsWithNewMessage,
} from "@config/gql/chat";
import { useLocation } from "@config/hooks/location";
// import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
// import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  // useNavigationContainerRef,
  Stack,
} from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider } from "react-native-outside-press";

import GlobalProvider from "@/components/GlobalProvider";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  /* dev tools */
  // const navigationRef = useNavigationContainerRef();
  // useReactNavigationDevTools(navigationRef);
  // useAsyncStorageDevTools();

  return (
    <GlobalProvider>
      <RootLayoutNav />
    </GlobalProvider>
  );
}

export const ChatContext = React.createContext({});

export const ChatProvider = ({ children }) => {
  const client = useApolloClient();
  const [refetchChatId, setRefetchChatId] = useState();
  const { loading } = useSubscription(CHAT_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data.data) {
        const newMessage = data.data.newMessage;
        const existingData = client.readQuery({
          query: CHAT_QUERY,
        });
        if (existingData) {
          const chatExists = existingData.allChats.some(
            (chat) => chat.id === newMessage.chat.id,
          );
          // Update the cache with the new message
          if (chatExists) {
            client.writeQuery({
              query: CHAT_QUERY,
              data: {
                allChats: updateChatsWithNewMessage(existingData, newMessage),
                me: existingData.me,
              },
            });
          } else {
            // If the chat doesn't exist, refetch the chat
            setRefetchChatId(newMessage.chat.id);
          }
        } else {
          setRefetchChatId(newMessage.chat.id);
        }
      }
    },
  });

  return (
    <ChatContext.Provider
      value={{
        loading,
        refetchChatId,
        setRefetchChatId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

function RootLayoutNav() {
  useLocation();

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
                      // presentation: "transparentModal",
                      animation: "slide_from_bottom",
                      headerShown: false,
                      animationDuration: 100,
                    }}
                  />
                  <Stack.Screen
                    name="detailMap"
                    options={{
                      // presentation: "transparentModal",
                      animation: "slide_from_bottom",
                      headerShown: false,
                      animationDuration: 100,
                    }}
                  />
                  <Stack.Screen
                    name="listing"
                    options={{
                      animation: "slide_from_right",
                      headerShown: false,
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
