import { gql, useMutation } from "@apollo/client";
import { Text, View } from "@components/Themed";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Button, Switch } from "@rneui/themed";
import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

const createFavoriteMutation = gql`
  mutation Mutation($name: String!, $private: Boolean!, $description: String!) {
    createFavorite(name: $name, private: $private, description: $description) {
      id
      name
    }
  }
`;

const favoriteByUserQuery = gql`
  query MyFavorites {
    myFavorites {
      id
      name
      private
    }
  }
`;

function CreateModal(data: any) {
  const snapPoints = useMemo(() => [320], []);
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
      refetchQueries: [
        {
          query: favoriteByUserQuery,
        },
      ],
    });
    data.bottomSheetModalRef.current?.close();

    setFolderName("");
    setDescription("");
    setChecked(false);
  };

  const renderBackdrop = useCallback(
    (propsBackdrop) => (
      <BottomSheetBackdrop
        {...propsBackdrop}
        enableTouchThrough
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={data.bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      enablePanDownToClose
    >
      <View style={styles.content}>
        <BottomSheetTextInput
          ref={data.inputRef}
          placeholder="*Name"
          value={folderName}
          onChangeText={setFolderName}
          style={styles.nameInput}
        />
      </View>

      <View style={styles.content}>
        <BottomSheetTextInput
          placeholder="Description: (optional)"
          value={description}
          onChangeText={setDescription}
          style={styles.descriptionInput}
          multiline
          textAlignVertical="top"
          numberOfLines={4}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.text}>Public</Text>
        <Switch
          value={checked}
          color="rgb(236, 76, 96)"
          onValueChange={(value) => setChecked(value)}
        />
      </View>

      <Button
        title="Save"
        size="md"
        radius="sm"
        type="solid"
        color="rgb(236, 76, 96)"
        containerStyle={{
          width: 100,
          alignSelf: "center",
        }}
        onPress={submitHandler}
      />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  text: {
    fontSize: 16,
    flexDirection: "row",
    padding: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  nameInput: {
    borderRadius: 10,
    fontSize: 16,
    height: 40,
    padding: 8,
    flex: 1,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  descriptionInput: {
    borderRadius: 10,
    fontSize: 16,
    height: 120,
    padding: 8,
    flex: 1,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
});

export default CreateModal;
