import { SafeAreaView, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function () {
  const colors = useThemedColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarStyle: {
          backgroundColor: colors.back1,
          borderTopColor: colors.border1,
        },
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          headerShadowVisible: false,
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="home"
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="hearto"
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="apps-outline"
              color={color}
              size={30}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="post"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                marginBottom: -18,
                padding: 7,
                borderRadius: 8,
                backgroundColor: colors.tint,
              }}
            >
              <Ionicons name="add" color={colors.textReverse} size={30} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="message1"
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleAlign: "center",
          header: () => {
            return <SafeAreaView edges={["top"]} />;
          },
          // headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="user"
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
