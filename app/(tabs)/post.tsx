import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { router } from "expo-router";

import NotLogIn from "@/components/NotLogIn";
import { Text, View } from "@/components/Themed";
import i18n from "@/config/localizations/i18n";
import { RootState, useSelector } from "@/config/state/store";
import { useThemedColors } from "@/constants/theme";

export default function () {
  const colors = useThemedColors();
  const { token } = useSelector((state: RootState) => state.appMeta);

  return (
    <View style={{ flex: 1 }}>
      {token ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
          theme={{ background: "back1" }}
        >
          {/* <SafeAreaView theme={{ background: "back1" }} edges={["top"]} /> */}

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
                color="#ec4c60"
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
                {i18n.t("post.post_listing.title")}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSub1,
                  marginBottom: 20,
                }}
              >
                {i18n.t("post.post_listing.description")}
              </Text>

              <Button
                containerStyle={{
                  width: "100%",
                }}
                buttonStyle={{
                  backgroundColor: "#ec4c60",
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                titleStyle={{
                  flexGrow: 1,
                  width: "100%",
                }}
                title={i18n.t("post.post_listing.button")}
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
      ) : (
        <NotLogIn
          icon={
            <MaterialIcons
              name="add-home-work"
              size={40}
              color="#ec4c60"
              style={{
                marginVertical: 20,
              }}
            />
          }
          title="post.not_sign_in.title"
          description="post.not_sign_in.description"
        />
      )}
    </View>
  );
}
