import { gql, useMutation } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateMutation = gql`
  mutation Mutation($email: String!, $veriCode: String!) {
    UpdateEmail(email: $email, veriCode: $veriCode) {
      email
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      email
    }
  }
`;

const sendVeriCodeMutation = gql`
  mutation SendVeriCode($email: String!) {
    SendVeriCode(email: $email)
  }
`;

function EditEmailScreen() {
  const [updateFunction] = useMutation(updateMutation);
  const [text, setText] = useState("");
  const [veriCode, setVeriCode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [sendVeriCodeFunction] = useMutation(sendVeriCodeMutation, {
    errorPolicy: "all",
  });

  const sendCodeHandler = async () => {
    try {
      if (text === "") {
        showMessage({
          message: "Email cannot be empty.",
          type: "danger",
        });
        return;
      }
      setIsButtonDisabled(true);
      sendVeriCodeFunction({ variables: { email: text } });
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

  const restoreSendButton = () => {
    setCountdown(0);
    setIsButtonDisabled(false);
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

  const updateHandler = () => {
    if (text === "") {
      showMessage({
        message: "Email cannot be empty.",
        type: "danger",
      });
      return;
    }
    if (veriCode === "") {
      showMessage({
        message: "Verification code cannot be empty.",
        type: "danger",
      });
      return;
    }

    const variables = {
      email: text,
      veriCode,
    };
    updateFunction({ variables, refetchQueries: [{ query: meQuery }] })
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
            title: "Edit Email",
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
            placeholder="New Email"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={text}
            onChangeText={(text) => {
              setText(text);
              console.log(text);
            }}
          />

          <Input
            placeholder="Verification Code"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={veriCode}
            rightIcon={
              <Ionicons
                name={countdown ? "lock-closed-outline" : "send-outline"}
                size={24}
                color="black"
                onPress={sendCodeHandler}
                disabled={isButtonDisabled}
              />
            }
            onChangeText={(text) => setVeriCode(text)}
          />
          {countdown > 0 && (
            <Text
              style={{ color: "gray", paddingLeft: 10 }}
            >{`Resend in ${countdown} seconds`}</Text>
          )}
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

export default EditEmailScreen;
