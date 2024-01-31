import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text, ScrollView, Pressable } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
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
  const colors = useThemedColors();
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      theme={{ background: "back2" }}
    >
      <Stack.Screen
        options={{
          title: "Edit Name",
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

        <Text style={{ paddingLeft: 10 }} theme={{ color: "textSub1" }}>
          Your name will be visible to other users.
        </Text>
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

export default EditNameScreen;
