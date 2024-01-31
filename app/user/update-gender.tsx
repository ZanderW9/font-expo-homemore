import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text, ScrollView, Pressable } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

const updateMutation = gql`
  mutation Mutation($gender: String) {
    UpdateUser(gender: $gender) {
      id
    }
  }
`;

const meQuery = gql`
  query Query {
    me {
      id
      gender
    }
  }
`;

function EditGenderScreen() {
  const colors = useThemedColors();
  const [updateFunction] = useMutation(updateMutation);
  const { data } = useQuery(meQuery);
  const [gender, setGender] = useState(data?.me?.gender);

  const updateHandler = () => {
    const variables = {
      gender,
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
          title: "Edit Gender",
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
            <Pressable onPress={() => updateHandler()}>
              <Text>Save</Text>
            </Pressable>
          ),
        }}
      />
      <View style={styles.content}>
        <Pressable style={styles.button} onPress={() => setGender("Male")}>
          <Text>Male</Text>
          {gender === "Male" && (
            <Ionicons name="checkmark" size={24} color={colors.textSub1} />
          )}
        </Pressable>

        <Pressable style={styles.button} onPress={() => setGender("Female")}>
          <Text>Female</Text>
          {gender === "Female" && (
            <Ionicons name="checkmark" size={24} color={colors.textSub1} />
          )}
        </Pressable>

        <Pressable style={styles.button} onPress={() => setGender("Other")}>
          <Text>Other</Text>
          {gender === "Other" && (
            <Ionicons name="checkmark" size={24} color={colors.textSub1} />
          )}
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setGender("Prefer not to say")}
        >
          <Text>Prefer not to say</Text>
          {gender === "Prefer not to say" && (
            <Ionicons name="checkmark" size={24} color={colors.textSub1} />
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separatorThin: {
    height: 1,
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 0.25,
  },
});

export default EditGenderScreen;
