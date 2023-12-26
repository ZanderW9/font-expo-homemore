import { View, Text } from "@components/Themed";
import Colors from "@constants/Colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import { useColorScheme, Pressable } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <AntDesign size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function () {
  const colorScheme = useColorScheme();

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
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 10,
              }}
            >
              <Pressable
                onPress={() => router.push("/search")}
                style={{
                  width: "92%",
                  minWidth: 260,
                  maxWidth: 400,
                  height: 35,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: Colors[colorScheme ?? "light"].tint,
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                }}
              >
                <Ionicons
                  name="search"
                  size={24}
                  color="gray"
                  style={{ marginRight: 10 }}
                />
                <Text>Explore here~</Text>
              </Pressable>
              <Ionicons
                name="ios-options-outline"
                size={24}
                color="gray"
                style={{ marginLeft: 10 }}
              />
            </View>
          ),
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
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
