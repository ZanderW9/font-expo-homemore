import { ListItem } from "@rneui/themed";
import { Stack } from "expo-router";
import * as Updates from "expo-updates";

import { View, Text } from "@/components/Themed";
import { useThemedColors } from "@/constants/theme";

export default function Screen() {
  const colors = useThemedColors();

  return (
    <View>
      <Stack.Screen
        options={{
          title: "About the App",
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
            <Text>Version: {Updates.runtimeVersion}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>VersionId: {Updates.updateId}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>Channel: {Updates.channel}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem containerStyle={{ backgroundColor: colors.back1 }}>
        <ListItem.Content>
          <ListItem.Title>
            <Text>Last Update: {Updates.createdAt?.toString()}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
}
