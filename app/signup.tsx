import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Text, View } from "../components/Themed";
import { storeToken } from "../config/TokenManager";
import {
  registerRequest,
  sendVerificationEmailRequest,
  userExistRequest,
} from "../config/requests";
import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  title: {
    fontSize: 15,
    color: Colors.light.tint,
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  validEmailIcon: {
    // color: "green",
    color: "black",
  },
  invalidEmailIcon: {
    // color: "red",
    color: "black",
  },
  verfication: {
    fontSize: 12,
    marginTop: -20,
    marginBottom: 20,
    textAlign: "right",
  },
});

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const restoreSendButton = () => {
    setCountdown(0);
    setIsButtonDisabled(false);
  };

  const verficationHandler = async () => {
    try {
      const userExist = await userExistRequest(email);
      if (!userExist.ok) {
        alert("User already exists.");
      } else {
        setIsButtonDisabled(true);
        const verification = await sendVerificationEmailRequest(email);
        setVerificationCode(verification.data.verificationCode);
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 60000);
        startCountDown();
      }
    } catch {
      setIsButtonDisabled(false);
      alert("Please check your email.");
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
    if (!userName || !email || !password || !confirmPassword || !userCode) {
      alert("Please fill in all fields.");
      return;
    }
    if (!isValidEmail) {
      alert("Please check your email.");
      return;
    }
    if (!passwordsMatch) {
      alert("Passwords do not match.");
      return;
    }
    if (verificationCode !== userCode) {
      alert("Please check your verification code.");
      return;
    }
    const body = {
      email,
      userName,
      password,
    };
    const response = await registerRequest(body);
    if (response.ok) {
      const token = response.data.token;
      await storeToken(token);
      router.push("/signin");
    } else {
      alert("Please check your email and password.");
    }
  };

  const gotoSigninHandler = () => {
    router.push("/signin");
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
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
      >
        <ScrollView>
          <View style={styles.container}>
            <Input
              placeholder="User Name"
              leftIcon={
                <Ionicons name="person-outline" size={24} color="black" />
              }
              onChangeText={(text) => setUserName(text)}
            />
            <Input
              placeholder="Email"
              leftIcon={
                <Ionicons name="mail-outline" size={24} color="black" />
              }
              rightIcon={
                isValidEmail ? (
                  <Ionicons
                    name="checkmark-done"
                    size={24}
                    style={styles.validEmailIcon}
                  />
                ) : (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    style={styles.invalidEmailIcon}
                  />
                )
              }
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
            />
            <Input
              placeholder="Password"
              secureTextEntry={!showPassword}
              leftIcon={
                <Ionicons name="keypad-outline" size={24} color="black" />
              }
              rightIcon={
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="black"
                  onPress={togglePasswordVisibility}
                />
              }
              onChangeText={(text) => setPassword(text)}
            />
            <Input
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              leftIcon={
                <Ionicons name="keypad-outline" size={24} color="black" />
              }
              rightIcon={
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="black"
                  onPress={togglePasswordVisibility}
                />
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
              placeholder="Verification Code"
              leftIcon={<Ionicons name="key-outline" size={24} color="black" />}
              rightIcon={
                <Ionicons
                  name={countdown ? "lock-closed-outline" : "send-outline"}
                  size={24}
                  color="black"
                  onPress={verficationHandler}
                  disabled={isButtonDisabled}
                />
              }
              onChangeText={(text) => setUserCode(text)}
            />
            {countdown > 0 && (
              <Text
                style={styles.verfication}
              >{`Resend in ${countdown} seconds`}</Text>
            )}

            <Button size="md" radius="sm" type="solid" onPress={SignUpHandler}>
              Sign Up
            </Button>
            <Text style={styles.title} onPress={gotoSigninHandler}>
              <Text>Already have an account? </Text>
              Sign In
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default LoginScreen;
