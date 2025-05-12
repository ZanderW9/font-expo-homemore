import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@rneui/themed";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Text, View } from "../components/Themed";
import { storeToken, getToken } from "../config/TokenManager";
import { loginRequest } from "../config/requests";
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
});

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const SignInHandler = async () => {
    const body = {
      email,
      password,
    };
    const response = await loginRequest(body);
    if (response.ok) {
      const token = response.data.token;
      await storeToken(token);
      router.replace("/profile");
    } else {
      alert("Please check your email and password.");
    }
  };

  const gotoSignupHandler = () => {
    router.push("/signup");
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
    const token = await getToken();
    if (token) {
      router.replace("/profile");
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

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
              placeholder="Email"
              leftIcon={
                <Ionicons name="person-outline" size={24} color="black" />
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
            <Button size="md" radius="sm" type="solid" onPress={SignInHandler}>
              Sign In
            </Button>
            <Text style={styles.title} onPress={gotoSignupHandler}>
              <Text>Don't have an account? </Text>
              Register
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default LoginScreen;
