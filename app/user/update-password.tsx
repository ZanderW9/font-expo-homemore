import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView, ScrollView } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateMutation = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    UpdatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      id
    }
  }
`;

function EditPasswordScreen() {
  const colors = useThemedColors();
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
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
      theme={{ background: "back2" }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        theme={{ background: "back2" }}
      >
        <Stack.Screen
          options={{
            title: "Set Password",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: colors.back1,
            },
            headerTitleStyle: {
              color: colors.text,
            },
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
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: colors.border1,
            }}
            inputStyle={{ color: colors.text }}
            value={oldPassword}
            secureTextEntry
            onChangeText={(text) => {
              setOldPassword(text);
            }}
          />

          <Input
            placeholder="New Password"
            containerStyle={styles.inputWrapper}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: colors.border1,
            }}
            inputStyle={{ color: colors.text }}
            value={text}
            secureTextEntry
            onChangeText={(text) => {
              setText(text);
            }}
          />

          <Input
            placeholder="Confirm Password"
            containerStyle={styles.inputWrapper}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: colors.border1,
            }}
            inputStyle={{ color: colors.text }}
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
  },
  inputWrapper: {
    marginBottom: -20,
  },
});

export default EditPasswordScreen;
