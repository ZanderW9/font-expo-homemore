import { ListItem } from "@rneui/themed";
import { Stack } from "expo-router";
import * as Updates from "expo-updates";

import { View, Text } from "@/components/Themed";
import i18n from "@/config/localizations/i18n";
import { useThemedColors } from "@/constants/theme";

export default function Screen() {
  const colors = useThemedColors();

  return (
    <View>
      <Stack.Screen
        options={{
          title: i18n.t("profile.settings.about.title"),
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
      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>
              {i18n.t("profile.settings.about.version")}:
              {Updates.runtimeVersion}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>
              {i18n.t("profile.settings.about.versionId")}: {Updates.updateId}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>
              {i18n.t("profile.settings.about.channel")}: {Updates.channel}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>
              {i18n.t("profile.settings.about.lastUpdate")}:
              {Updates.createdAt?.toString()}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
