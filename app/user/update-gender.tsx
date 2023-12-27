import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView, SafeAreaView, Pressable } from "react-native";
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
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Edit Gender",
            headerTitleAlign: "center",
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
              <Ionicons name="checkmark" size={24} color="gray" />
            )}
          </Pressable>

          <View
            style={styles.separatorThin}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <Pressable style={styles.button} onPress={() => setGender("Female")}>
            <Text>Female</Text>
            {gender === "Female" && (
              <Ionicons name="checkmark" size={24} color="gray" />
            )}
          </Pressable>

          <View
            style={styles.separatorThin}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <Pressable style={styles.button} onPress={() => setGender("Other")}>
            <Text>Other</Text>
            {gender === "Other" && (
              <Ionicons name="checkmark" size={24} color="gray" />
            )}
          </Pressable>

          <View
            style={styles.separatorThin}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <Pressable
            style={styles.button}
            onPress={() => setGender("Prefer not to say")}
          >
            <Text>Prefer not to say</Text>
            {gender === "Prefer not to say" && (
              <Ionicons name="checkmark" size={24} color="gray" />
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default EditGenderScreen;
