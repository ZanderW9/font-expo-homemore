import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateMutation = gql`
  mutation Mutation($userName: String) {
    UpdateUser(userName: $userName) {
      id
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      userName
    }
  }
`;

function EditNameScreen() {
  const [updateFunction] = useMutation(updateMutation);
  const { data } = useQuery(meQuery);
  const [text, setText] = useState(data?.me?.userName);

  const updateHandler = () => {
    if (text === "") {
      showMessage({
        message: "Name cannot be empty.",
        type: "danger",
      });
      return;
    }
    const variables = {
      userName: text,
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
            title: "Edit Name",
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
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            value={text}
            onChangeText={(text) => {
              setText(text);
            }}
          />

          <Text style={{ color: "gray", paddingLeft: 10 }}>
            Your name will be visible to other users.
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

export default EditNameScreen;
