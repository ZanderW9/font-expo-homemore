import { gql, useMutation } from "@apollo/client";
import { View, Text, ScrollView, Pressable } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
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
  const colors = useThemedColors();
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      theme={{ background: "back2" }}
    >
      <Stack.Screen
        options={{
          title: "Edit Email",
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
          placeholder="New Email"
          containerStyle={styles.inputWrapper}
          inputContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border1,
          }}
          inputStyle={{ color: colors.text }}
          value={text}
          onChangeText={(text) => {
            setText(text);
          }}
        />

        <Input
          placeholder="Verification Code"
          containerStyle={styles.inputWrapper}
          inputContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border1,
          }}
          inputStyle={{ color: colors.text }}
          value={veriCode}
          rightIcon={
            <Ionicons
              name={countdown ? "lock-closed-outline" : "send-outline"}
              size={24}
              color={colors.text}
              onPress={sendCodeHandler}
              disabled={isButtonDisabled}
            />
          }
          onChangeText={(text) => setVeriCode(text)}
        />
        {countdown > 0 && (
          <Text
            theme={{ color: "textSub1" }}
            style={{ paddingLeft: 10 }}
          >{`Resend in ${countdown} seconds`}</Text>
        )}
      </View>
    </ScrollView>
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

export default EditEmailScreen;
