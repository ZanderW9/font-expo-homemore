import { gql, useMutation, useQuery } from "@apollo/client";
import { Text, View } from "@components/Themed";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Button, Switch } from "@rneui/themed";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

const favoriteByIdQuery = gql`
  query Query($favoriteId: String) {
    myFavorites(favoriteId: $favoriteId) {
      id
      name
      description
      private
    }
  }
`;

const updateFavoriteMutation = gql`
  mutation Mutation(
    $favoriteId: String!
    $name: String!
    $description: String!
    $private: Boolean!
  ) {
    updateFavorite(
      favoriteId: $favoriteId
      name: $name
      description: $description
      private: $private
    ) {
      id
    }
  }
`;

function UpdateModal(data: any) {
  const { data: favoriteData, refetch } = useQuery(favoriteByIdQuery, {
    variables: { favoriteId: data.favoriteId },
    errorPolicy: "all",
  });

  const snapPoints = useMemo(() => [320], []);
  const [folderName, setFolderName] = useState(
    favoriteData?.myFavorites[0].name,
  );
  const [description, setDescription] = useState(
    favoriteData?.myFavorites[0].description,
  );
  const [checked, setChecked] = useState(!favoriteData?.myFavorites[0].private);

  const [updateFavoriteFunction] = useMutation(updateFavoriteMutation, {
    errorPolicy: "all",
  });

  useEffect(() => {
    // Update component state when favoriteData changes
    if (favoriteData && favoriteData.myFavorites[0]) {
      const {
        name,
        description,
        private: isPrivate,
      } = favoriteData.myFavorites[0];
      setFolderName(name);
      setDescription(description);
      setChecked(!isPrivate);
    }
  }, [favoriteData]);

  useEffect(() => {
    // Refetch data when favoriteId changes
    refetch({ favoriteId: data.favoriteId });
  }, [data.favoriteId, refetch]);

  const submitHandler = async () => {
    if (folderName.trim() === "") {
      showMessage({
        type: "danger",
        message: "Name is required",
      });
      return;
    }
    updateFavoriteFunction({
      variables: {
        favoriteId: data.favoriteId,
        name: folderName,
        private: !checked,
        description,
      },
      refetchQueries: [
        {
          query: favoriteByIdQuery,
          variables: { favoriteId: data.favoriteId },
        },
      ],
    });
    data.bottomSheetModalRef.current?.close();
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
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

export default UpdateModal;
