import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import useUserLocation from "@config/hooks/useUserLocation";
import { getLocalItem } from "@config/storageManager";
import { BACKEND_URL } from "@env";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState, createContext } from "react";
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

export const GlobalContext = createContext();

function RootLayoutNav() {
  const httpLink = new HttpLink({ uri: `${BACKEND_URL}/graphql` });

  const authLink = setContext(async (_, { headers }) => {
    // Get the authentication token from local storage if it exists
    const token = await getLocalItem("userToken");
    console.log(token);
    // Return the headers to the context so HTTP link can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allListings: {
              keyArgs: false,
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
  });
  const colorScheme = useColorScheme();
  useUserLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <ApolloProvider client={client}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
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
                animation: "slide_from_bottom",
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
          </Stack>
          <FlashMessage
            position="top"
            floating
            statusBarHeight={Platform.OS === "ios" ? null : 35}
          />
        </ThemeProvider>
      </ApolloProvider>
    </GlobalContext.Provider>
  );
}
