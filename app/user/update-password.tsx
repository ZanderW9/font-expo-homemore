import { gql, useMutation } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateMutation = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    UpdatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      id
    }
  }
`;

function EditPasswordScreen() {
  const [updateFunction] = useMutation(updateMutation);
  const [oldPassword, setOldPassword] = useState("");
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");

  const updateHandler = () => {
    if (text !== text2) {
      showMessage({
        message: "Passwords do not match.",
        type: "danger",
      });
      return;
    }

    if (text === "") {
      showMessage({
        message: "Password cannot be empty.",
        type: "danger",
      });
      return;
    }

    const variables = {
      oldPassword,
      newPassword: text,
    };
    updateFunction({ variables })
      .then(() => {
        router.back();
      })
      .catch((error) => {
        showMessage({
          message: error.message,
          type: "danger",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Set Password",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            animation: "slide_from_right",
            headerRight: () => (
              <Pressable onPress={updateHandler}>
                <Text>Save</Text>
              </Pressable>
            ),
          }}
        />
        <View style={styles.content}>
          <Input
            placeholder="Old Password"
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={oldPassword}
            secureTextEntry
            onChangeText={(text) => {
              setOldPassword(text);
            }}
          />

          <Input
            placeholder="New Password"
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={text}
            secureTextEntry
            onChangeText={(text) => {
              setText(text);
            }}
          />

          <Input
            placeholder="Confirm Password"
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={text2}
            secureTextEntry
            onChangeText={(text) => {
              setText2(text);
            }}
          />

          <Text style={{ color: "gray", paddingLeft: 10 }}>
            Use 8 or more characters with a mix of letters, numbers & symbols.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    backgroundColor: "white",
  },
  inputContainer: {
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -20,
  },
});

export default EditPasswordScreen;
