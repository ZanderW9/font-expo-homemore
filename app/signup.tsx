import { gql, useMutation } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "@components/Themed";
import { storeLocalItem } from "@config/storageManager";
import Colors from "@constants/Colors";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@rneui/themed";
import { router, Stack } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Platform } from "react-native";
import { showMessage } from "react-native-flash-message";

const signUpMutation = gql`
  mutation (
    $userName: String!
    $email: String!
    $password: String!
    $veriCode: String!
  ) {
    SignUp(
      userName: $userName
      email: $email
      password: $password
      veriCode: $veriCode
    ) {
      token
      user {
        id
        userName
        avatar
      }
    }
  }
`;

const SEND_VERICODE_MUTATION = gql`
  mutation sendcode($email: String!, $type: String!) {
    SendVeriCode(email: $email, type: $type)
  }
`;

function LoginScreen() {
  const colors = useThemedColors();
  const { httpLinkUrl, setToken, setIsLoggedIn, setApolloClient, setMe } =
    useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [veriCode, setVeriCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const [signUpFunction, { data, loading, error }] = useMutation(
    signUpMutation,
    { errorPolicy: "all" },
  );

  const [sendVeriCodeFunction] = useMutation(SEND_VERICODE_MUTATION, {
    errorPolicy: "all",
  });

  useEffect(() => {
    if (error) {
      error.graphQLErrors.map(() => {
        showMessage({
          type: "danger",
          message: "User already exists.",
        });
      });
    }
  }, [error]);

  const restoreSendButton = () => {
    setCountdown(0);
    setIsButtonDisabled(false);
  };

  const sendCodeHandler = async () => {
    try {
      if (email === "") {
        showMessage({
          message: "Email cannot be empty.",
          type: "danger",
        });
        return;
      }
      setIsButtonDisabled(true);
      sendVeriCodeFunction({ variables: { email, type: "signUp" } });
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 60000);
      startCountDown();
    } catch {
      setIsButtonDisabled(false);
      showMessage({
        type: "danger",
        message: "Please check your email.",
      });
    }
  };

  const startCountDown = () => {
    setIsButtonDisabled(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          restoreSendButton();
          return 60;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  };

  const SignUpHandler = async () => {
    if (!userName || !email || !password || !confirmPassword || !veriCode) {
      showMessage({
        type: "danger",
        message: "Please fill in all fields.",
      });
      return;
    }
    if (!isValidEmail) {
      showMessage({
        type: "danger",
        message: "Please enter a valid email.",
      });
      return;
    }
    if (!passwordsMatch) {
      showMessage({
        type: "danger",
        message: "Passwords do not match.",
      });
      return;
    }

    if (!loading && data) {
      storeLocalItem("userToken", data.SignUp.token);
      setIsLoggedIn(true);
      setToken(data.SignUp.token);
      setApolloClient(data.SignUp.token, httpLinkUrl);
      setMe(data.SignUp.user);
      router.replace("/profile");
    }
    signUpFunction({ variables: { userName, email, password, veriCode } });
  };

  const gotoSigninHandler = () => {
    router.navigate("/signin");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (inputText: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValid = emailPattern.test(inputText);
    setIsValidEmail(isValid);
  };

  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: "Sign Up",
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
        theme={{ background: "back2" }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          theme={{ background: "back2" }}
        >
          <Input
            label="User Name"
            labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={[
              styles.inputContainer,
              { borderColor: colors.border1 },
            ]}
            inputStyle={{ color: colors.text }}
            onChangeText={(text) => setUserName(text)}
          />
          <Input
            label="Email"
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
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
          />
          <Input
            label="Password"
            labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={[
              styles.inputContainer,
              { borderColor: colors.border1 },
            ]}
            inputStyle={{ color: colors.text }}
            secureTextEntry={!showPassword}
            rightIcon={
              password && (
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="black"
                  onPress={togglePasswordVisibility}
                />
              )
            }
            onChangeText={(text) => setPassword(text)}
          />
          <Input
            label="Confirm Password"
            labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={[
              styles.inputContainer,
              { borderColor: colors.border1 },
            ]}
            inputStyle={{ color: colors.text }}
            secureTextEntry={!showPassword}
            rightIcon={
              confirmPassword && (
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="black"
                  onPress={togglePasswordVisibility}
                />
              )
            }
            onChangeText={(text) => {
              setConfirmPassword(text);
              setPasswordsMatch(text === password);
            }}
            errorStyle={!passwordsMatch ? { color: "red" } : null}
            errorMessage={
              !passwordsMatch ? "Passwords do not match" : undefined
            }
          />
          <Input
            label="Verification Code"
            labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={[
              styles.inputContainer,
              { borderColor: colors.border1 },
            ]}
            inputStyle={{ color: colors.text }}
            rightIcon={
              isValidEmail && (
                <Ionicons
                  name={countdown ? "lock-closed-outline" : "send-outline"}
                  size={24}
                  color="black"
                  onPress={sendCodeHandler}
                  disabled={isButtonDisabled}
                />
              )
            }
            onChangeText={(text) => setVeriCode(text)}
          />
          {countdown > 0 && (
            <Text
              style={styles.verfication}
            >{`Resend in ${countdown} seconds`}</Text>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
            theme={{ background: "back2" }}
          >
            <Button
              buttonStyle={{
                backgroundColor: "rgb(236, 76, 96)",
                height: 50,
                width: 100,
                borderRadius: 7,
                marginVertical: 10,
              }}
              onPress={SignUpHandler}
            >
              Sign Up
            </Button>
          </View>

          <Text style={styles.title} onPress={gotoSigninHandler}>
            <Text>Already have an account? </Text>
            Sign In
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 15,
    color: Colors.light.tint,
    marginTop: 20,
    marginLeft: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  verfication: {
    fontSize: 12,
    marginTop: -20,
    marginBottom: 20,
    textAlign: "right",
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
