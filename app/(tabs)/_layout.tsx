import { SafeAreaView, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function () {
  const { t } = useTranslation();
  const colors = useThemedColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarStyle: {
          backgroundColor: colors.back1,
          borderTopColor: colors.border1,
          paddingBottom: insets.bottom === 0 ? 3 : insets.bottom,
        },
        tabBarAllowFontScaling: false,
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          headerShadowVisible: false,
          title: t("mainTab.explore"),
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" color={color} size={26} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: t("mainTab.wishlist"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="hearto" color={color} size={25} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="services"
        options={{
          title: t("mainTab.services"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="apps-outline"
              color={color}
              size={26}
            />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="post"
        options={{
          title: "",
          headerShown: false,
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            marginTop: 3,
          },
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                aspectRatio: 1,
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ec4c60",
                borderRadius: 8,
                marginBottom: -(insets.bottom / 10),
              }}
            >
              <Ionicons name="add" color="#f5f5f5" size={30} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: t("mainTab.inbox"),
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="message1" color={color} size={25} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("mainTab.profile"),
          headerTitleAlign: "center",
          header: () => {
            return <SafeAreaView edges={["top"]} />;
          },
          // headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" color={color} size={26} />
          ),
        }}
      />
    </Tabs>
  );
}
