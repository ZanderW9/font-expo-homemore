import { ListItem } from "@rneui/themed";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { View, Text } from "@/components/Themed";
import { useThemedColors } from "@/constants/theme";

export default function Screen() {
  const colors = useThemedColors();
  const { t } = useTranslation();
  return (
    <View theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: t("profile.settings.title"),
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerBackButtonMenuEnabled: false,
          headerBackTitleVisible: false,
        }}
      />
      <ListItem
        containerStyle={{ backgroundColor: colors.back1 }}
        onPress={() => {
          router.navigate("/profile/settings/about");
        }}
      >
        <ListItem.Content>
          <ListItem.Title>
            <Text>{t("profile.settings.about_button")}</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        containerStyle={{ backgroundColor: colors.back1, marginTop: 10 }}
        onPress={() => {
          router.navigate("/profile/settings/language");
        }}
      >
        <ListItem.Content>
          <ListItem.Title>
            <Text>{t("profile.settings.language_button")}</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </View>
  );
}
