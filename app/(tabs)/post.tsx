import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { router } from "expo-router";

import { Text, View, SafeAreaView } from "@/components/Themed";
import { useThemedColors } from "@/constants/theme";

export default function () {
  const colors = useThemedColors();
  return (
    <View
      style={{ flex: 1, alignItems: "center", paddingHorizontal: 20 }}
      theme={{ background: "back1" }}
    >
      <SafeAreaView theme={{ background: "back1" }} edges={["top"]} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            padding: 20,
            width: "100%",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="add-home-work"
            size={40}
            color={colors.tint}
            style={{
              marginVertical: 20,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 8,
              width: "100%",
            }}
          >
            It's time for you to post a listing!
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.textSub1,
              marginBottom: 20,
            }}
          >
            Any kind of property, house or apartment, short or long term......
            click below to get started!
          </Text>

          <Button
            buttonStyle={{
              backgroundColor: colors.tint,
              borderRadius: 8,
              width: "100%",
            }}
            title="Post your listing"
            onPress={() => router.navigate("/listing/step-1")}
          />
        </View>

        {/* <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            padding: 20,
            marginTop: 20,
            width: "100%",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="cleaning-services"
            size={40}
            color={colors.tint}
            style={{
              marginVertical: 20,
            }}
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: colors.text,
              marginBottom: 8,
              width: "100%",
            }}
          >
            Want some service for your property?
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.textSub1,
              marginBottom: 20,
            }}
          >
            Cleaning, maintenance, or any other service you need, we've got you
            covered!
          </Text>

          <Button
            buttonStyle={{
              backgroundColor: colors.tint,
              borderRadius: 8,
              width: "100%",
            }}
            title="Find a service"
            onPress={() => router.navigate("/listing/step-1")}
          />
        </View> */}
      </View>
    </View>
  );
}
