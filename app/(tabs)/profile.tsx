import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableHighlight,
} from "react-native";

import { Text, View } from "../../components/Themed";
import { clearToken, getToken } from "../../config/TokenManager";

function TabProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken();
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const signInHandler = async () => {
    router.push("/signin");
  };

  const signUpHandler = async () => {
    router.push("/signup");
  };

  const logOutHandler = async () => {
    await clearToken();
    setIsLoggedIn(false);
    router.replace("/profile");
  };

  const createListingHandler = async () => {
    router.push("/create");
  };

  const changePasswordHandler = async () => {
    router.push("/changepassword");
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
      >
        <ScrollView>
          <View style={styles.container}>
            {!isLoggedIn && (
              <>
                <TouchableHighlight onPress={signUpHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Sign Up</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={signInHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Sign In</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
              </>
            )}

            {isLoggedIn && (
              <View style={styles.container}>
                <TouchableHighlight onPress={createListingHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Create Listing</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={createListingHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Manage Listing</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={createListingHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Manage Booking</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={changePasswordHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
                <TouchableHighlight onPress={logOutHandler}>
                  <View style={styles.buttonWrapper}>
                    <Text style={styles.title}>Log Out</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  </View>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
});

export default TabProfileScreen;
