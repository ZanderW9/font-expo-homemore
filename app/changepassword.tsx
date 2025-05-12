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

import { View } from "../components/Themed";
import { changePasswordRequest } from "../config/requests";
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

function ChangePasswordScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ChangePwHandler = async () => {
    const body = {
      password,
    };
    const response = await changePasswordRequest(body);
    if (response.ok) {
      router.push("/profile");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              placeholder="New Password"
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
            />
            <Button
              size="md"
              radius="sm"
              type="solid"
              onPress={ChangePwHandler}
            >
              Save
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default ChangePasswordScreen;
