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

const httpLink = new HttpLink({ uri: `${BACKEND_URL}/graphql` });

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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allListings: {
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
    }),
  });

  const colorScheme = useColorScheme();
  useUserLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <ApolloProvider client={client}>
      <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
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
      </GlobalContext.Provider>
    </ApolloProvider>
  );
}
