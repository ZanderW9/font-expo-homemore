import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "@rneui/themed";
import { Stack } from "expo-router";

import { View, Text } from "@/components/Themed";
import { updateAppMeta } from "@/config/state/appMetaSlice";
import { RootState, useDispatch, useSelector } from "@/config/state/store";
import { storeLocalItem } from "@/config/storageManager";
import { useThemedColors } from "@/constants/theme";

const languageSettings = [
  { code: "zh", name: "中文" },
  { code: "en", name: "English" },
];

export default function Screen() {
  const colors = useThemedColors();
  const dispatch = useDispatch();
  const { locale } = useSelector((state: RootState) => state.appMeta);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Language Settings",
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
      {languageSettings.map((lang) => (
        <ListItem
          key={lang.code}
          containerStyle={{ backgroundColor: colors.back1 }}
          onPress={async () => {
            dispatch(updateAppMeta({ locale: lang.code }));
            await storeLocalItem("locale", lang.code);
          }}
        >
          <ListItem.Content
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ListItem.Title>
              <Text>{lang.name}</Text>
            </ListItem.Title>
            {lang.code === locale && (
              <Ionicons name="checkmark" size={20} color={colors.text} />
            )}
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}
