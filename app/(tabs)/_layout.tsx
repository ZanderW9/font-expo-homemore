import { GlobalContext } from "@app/_layout";
import Colors from "@constants/Colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <AntDesign size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function () {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          headerShadowVisible: false,
          title: "Explore",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="hearto" color={color} />,
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerTitleAlign: "center",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="message1" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleAlign: "center",
          header: () => {
            return (
              <SafeAreaView
                style={{ backgroundColor: isLoggedIn ? "white" : "#f5f5f5" }}
                edges={["top"]}
              />
            );
          },
          // headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
