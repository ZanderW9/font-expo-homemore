import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import { storeLocalItem } from "@config/storageManager";
import Colors from "@constants/Colors";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@rneui/themed";
import { router, Stack, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, ActivityIndicator } from "react-native";
import { showMessage } from "react-native-flash-message";

import { updateAppMeta } from "@/config/state/appMetaSlice";
import { RootState, useDispatch, useSelector } from "@/config/state/store";

const signInMutation = gql`
  mutation SignIn($email: String!, $password: String!) {
    SignIn(email: $email, password: $password) {
      token
      user {
        id
        userName
        avatar
      }
    }
  }
`;

function LoginScreen() {
  const { t } = useTranslation();
  const colors = useThemedColors();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.appMeta);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [signInFunction, { data, loading, error }] = useMutation(
    signInMutation,
    { errorPolicy: "all" },
  );

  useEffect(() => {
    if (error) {
      error.graphQLErrors.map(() => {
        showMessage({
          type: "danger",
          message: "Invalid email or password",
        });
      });
    }
  }, [error]);

  useEffect(() => {
    async function signInAsync() {
      if (!loading && data) {
        storeLocalItem("token", data.SignIn.token);

        dispatch(
          updateAppMeta({ user: data.SignIn.user, token: data.SignIn.token }),
        );

        router.canGoBack() && router.back();
        router.replace("/profile");
      }
    }
    signInAsync();
  }, [loading, data]);

  const SignInHandler = async () => {
    signInFunction({ variables: { email, password } });
  };

  const gotoSignupHandler = () => {
    router.navigate("/user/sign-up");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (inputText: string) => {
    const lowercaseEmail = inputText.toLowerCase();
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const isValid = emailPattern.test(lowercaseEmail);
    setIsValidEmail(isValid);
    setEmail(lowercaseEmail);
  };

  const autoLogin = async () => {
    if (token) {
      router.replace("/profile");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      autoLogin();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerBackButtonMenuEnabled: false,
          headerStyle: {
            backgroundColor: colors.back1,
          },
        }}
      />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingBottom: "60%",
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 20 }}>
          {t("sign_in_options.with_email")}
        </Text>
        <Input
          label={t("email")}
          labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          inputStyle={{ color: colors.text }}
          rightIcon={
            isValidEmail && (
              <Ionicons name="checkmark" size={24} color={colors.text} />
            )
          }
          enterKeyHint="done"
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
        />
        <Input
          label={t("password")}
          labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          inputStyle={{ color: colors.text }}
          secureTextEntry={!showPassword}
          enterKeyHint="done"
          rightIcon={
            password && (
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={colors.text}
                onPress={togglePasswordVisibility}
              />
            )
          }
          onChangeText={(text) => setPassword(text)}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            buttonStyle={{
              backgroundColor: "rgb(236, 76, 96)",
              width: "100%",
              borderRadius: 10,
              marginVertical: 10,
            }}
            onPress={SignInHandler}
            title={
              loading ? (
                <ActivityIndicator color={colors.textReverse} size="small" />
              ) : (
                t("sign_in")
              )
            }
          />
        </View>
        <Text style={styles.title} onPress={gotoSignupHandler}>
          <Text>{t("dont_have_account")}</Text> {t("sign_up")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    color: Colors.light.tint,
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -10,
  },
});

export default LoginScreen;
