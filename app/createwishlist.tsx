import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Switch } from "@rneui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Pressable, ScrollView } from "react-native";
import { showMessage } from "react-native-flash-message";

const createFavoriteMutation = gql`
  mutation Mutation($name: String!, $private: Boolean!, $description: String!) {
    createFavorite(name: $name, private: $private, description: $description) {
      id
      name
    }
  }
`;

function CreatewishlistScreen() {
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState(false);
  const [createFavoriteFunction] = useMutation(createFavoriteMutation, {
    errorPolicy: "all",
  });

  const submitHandler = async () => {
    if (folderName.trim() === "") {
      showMessage({
        type: "danger",
        message: "Name is required",
      });
      return;
    }
    createFavoriteFunction({
      variables: { name: folderName, private: !checked, description },
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={{ flex: 1, width: "100%" }}
        onPress={() => router.back()}
      >
        <Text />
      </Pressable>
      <View style={styles.modalHeader}>
        <Ionicons
          name="close"
          size={24}
          color="gray"
          style={styles.closeButton}
          onPress={() => router.back()}
        />
        <Text style={styles.modalTitle}>Create</Text>
      </View>
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={{ flex: 1, width: "100%", padding: 10 }}>
          <Input
            placeholder="*Name"
            onChangeText={(text) => {
              setFolderName(text);
            }}
          />
          <Input
            placeholder="Description: (optional)"
            multiline
            numberOfLines={4}
            onChangeText={(text) => {
              setDescription(text);
            }}
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
            }}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.modalSubTitle}>Public</Text>
            <Switch
              value={checked}
              onValueChange={(value) => setChecked(value)}
            />
          </View>
        </ScrollView>
        <Button
          title="Submit"
          size="lg"
          radius="sm"
          type="solid"
          containerStyle={{
            width: 200,
            alignSelf: "center",
          }}
          onPress={submitHandler}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  safeContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "70%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 40,
    textAlign: "left",
  },
  modalSubTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 10,
    marginTop: 10,
    marginRight: 20,
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    left: 10,
    zIndex: 1,
  },

  modalHeader: {
    height: 50,
    borderBottomColor: "rgba(230, 230, 230, 1)",
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default CreatewishlistScreen;
