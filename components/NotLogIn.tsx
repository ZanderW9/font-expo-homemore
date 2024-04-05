import { View, Text } from "@components/Themed";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { useThemedColors } from "@/constants/theme";

export const signInHandler = async () => {
  router.navigate("/user/sign-in");
};

export const signUpHandler = async () => {
  router.navigate("/user/sign-up");
};

function NotLogIn(props: { icon: any; title: string; description: string }) {
  const { t } = useTranslation();
  const colors = useThemedColors();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
      }}
      theme={{ background: "back1" }}
    >
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
          {props.icon}

          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 8,
              width: "100%",
            }}
          >
            {t(props.title)}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.textSub1,
              marginBottom: 20,
            }}
          >
            {t(props.description)}
          </Text>

          <Button
            containerStyle={{
              width: "100%",
              marginBottom: 6,
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
            title={t("sign_in")}
            onPress={() => router.navigate("/user/sign-in")}
          />

          <View
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: colors.textSub1,
              }}
            >
              {t("dont_have_account")}
            </Text>
            <Button
              type="clear"
              titleStyle={{
                fontSize: 16,
                color: "#ec4c60",
              }}
              title={t("sign_up")}
              onPress={signUpHandler}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default NotLogIn;
