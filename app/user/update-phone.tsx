import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateMutation = gql`
  mutation Mutation($phone: String) {
    UpdateUser(phone: $phone) {
      id
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      phone
    }
  }
`;

function EditPhoneScreen() {
  const [updateFunction] = useMutation(updateMutation);
  const { data } = useQuery(meQuery);
  const [text, setText] = useState(data?.me?.phone);

  const updateHandler = () => {
    if (text === "") {
      showMessage({
        message: "Phone cannot be empty.",
        type: "danger",
      });
      return;
    }
    const variables = {
      phone: text,
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
            title: "Edit Phone Number",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            headerRight: () => (
              <Pressable onPress={updateHandler}>
                <Text>Save</Text>
              </Pressable>
            ),
          }}
        />
        <View style={styles.content}>
          <Input
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={text}
            onChangeText={(text) => {
              setText(text);
            }}
          />

          <Text style={{ color: "gray", paddingLeft: 10 }}>
            Phone number must be in the format of +61 04xx xxx xxx
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

export default EditPhoneScreen;
