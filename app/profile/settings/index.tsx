import { ListItem } from "@rneui/themed";
import { router, Stack } from "expo-router";

import { View, Text } from "@/components/Themed";
import { useThemedColors } from "@/constants/theme";

export default function Screen() {
  const colors = useThemedColors();

  return (
    <View theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: "Settings",
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
            <Text>About the App</Text>
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
            <Text>language</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </View>
  );
}
