import { gql, useMutation } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import { View, Text, SafeAreaView, ScrollView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { compressImage } from "@config/media";
import { signImageUrl } from "@config/requests";
import { uploadImage } from "@config/s3";
import { useThemedColors } from "@constants/theme";
import { CommonActions } from "@react-navigation/native";
import { Button, Dialog } from "@rneui/themed";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, Stack, useNavigation } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DraggableGrid } from "react-native-draggable-grid";

const updateListingMutation = gql`
  mutation UpdateListing(
    $updateListingId: String!
    $images: [String]
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      images: $images
      published: $published
    ) {
      id
    }
  }
`;

function UploadPhotos() {
  const { listingData, dispatchListingData } = useCreateListingContext();
  const { httpLinkUrl } = useContext(GlobalContext);
  const colors = useThemedColors();

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [updateListingFunction] = useMutation(updateListingMutation);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteKey, setDeleteKey] = useState("");

  const nextHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        images: listingData.images,
      },
    });
    router.navigate("/listing/upload-title");
  };

  const backHandler = async () => {
    router.back();
  };

  const navigation = useNavigation();
  const handleResetAction = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: "save-success" }],
      }),
    );
  };

  const saveAndExitHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        serviceType: listingData.serviceType,
        published: false,
      },
    });
    handleResetAction();
  };

  const deleteImage = (key: string) => {
    setShowDeleteDialog(true);
    setDeleteKey(key);
  };

  const confirmDelete = () => {
    const updatedImages = listingData.images?.filter(
      (image) => image !== deleteKey,
    );
    dispatchListingData({ ...listingData, images: updatedImages });
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const newImages: string[] = [];

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(
          result.assets.map(async (asset) => {
            const fileName = asset.uri.split("/").pop();
            const fileType = fileName?.split(".").pop();
            const res = await signImageUrl(httpLinkUrl, fileName, fileType);
            if (res.ok) {
              const { data } = res;
              const { signedUrl, objectUrl } = data;
              newImages.push(objectUrl);
              // 通过 signedUrl 上传图片
              const compressedAsset = await compressImage(asset.uri);
              await uploadImage(signedUrl, fileType, compressedAsset);
            }
          }),
        );
        dispatchListingData({
          ...listingData,
          images: [...listingData.images, ...newImages],
        });
      }
    } catch {
      // do nothing
    }
  };

  function renderImageGridItem(item, index) {
    return (
      <View style={[styles.imageContainer, { borderColor: colors.border1 }]}>
        <Image source={{ uri: item.uri }} style={[styles.image]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title=" Save & Exit"
        type="clear"
        onPress={saveAndExitHandler}
        buttonStyle={{
          justifyContent: "flex-start",
          marginTop: 40,
          marginHorizontal: 10,
        }}
        titleStyle={{
          color: "rgb(236, 76, 96)",
          alignSelf: "center",
          justifyContent: "center",
        }}
      />
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerShown: false,
        }}
      />

      <ScrollView
        scrollEnabled={scrollEnabled}
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <Text style={styles.title}>Upload Photos</Text>
        <Text style={styles.subtitle}>
          Add photos of your place to attract more guests
        </Text>
        <View theme={{ background: "back1" }}>
          <DraggableGrid
            numColumns={2}
            style={{ flex: 1 }}
            onItemPress={(item) => deleteImage(item.uri)}
            onDragStart={() => setScrollEnabled(false)}
            renderItem={(item, index) => renderImageGridItem(item, index)}
            data={listingData.images.map((uri, index) => ({ uri, key: uri }))}
            onDragRelease={(data) => {
              const newImages = data.map((item) => item.uri);
              dispatchListingData({ ...listingData, images: newImages });
              setScrollEnabled(true);
            }}
          />
          <TouchableOpacity
            onPress={pickImage}
            style={{ alignItems: "center" }}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        {/* 进度条 */}
        <MyStepIndicator currentPosition={2} stepCount={6} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginHorizontal: 20,
            justifyContent: "space-between",
          }}
          theme={{ background: "back1" }}
        >
          <Button
            title="Back"
            type="outline"
            onPress={backHandler}
            buttonStyle={{
              borderColor: "rgb(236, 76, 96)",
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
            titleStyle={{
              color: "rgb(236, 76, 96)",
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
          <Button
            title="Next"
            onPress={nextHandler}
            disabled={listingData?.images?.length === 0}
            buttonStyle={{
              backgroundColor: "rgb(236, 76, 96)",
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
          />
        </View>
      </SafeAreaView>
      {/* 删除确认弹窗 */}
      <Dialog
        isVisible={showDeleteDialog}
        onBackdropPress={cancelDelete}
        overlayStyle={{ borderRadius: 10, backgroundColor: colors.back1 }}
      >
        <Text>Are you sure you want to delete this image?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Dialog.Button title="Cancel" onPress={cancelDelete} />
          <Dialog.Button
            title="Delete"
            titleStyle={{ color: "red" }}
            onPress={confirmDelete}
          />
        </View>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    paddingBottom: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 180,
    padding: 4,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  plusIcon: {
    fontSize: 50,
    color: "#ccc",
  },
});

export default UploadPhotos;
