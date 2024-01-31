import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text, ScrollView, Pressable } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
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
  const colors = useThemedColors();
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      theme={{ background: "back2" }}
    >
      <Stack.Screen
        options={{
          title: "Edit Phone Number",
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
          Phone number must be in the format of +61 04xx xxx xxx
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
  inputContainer: {
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -20,
  },
});

export default EditPhoneScreen;
