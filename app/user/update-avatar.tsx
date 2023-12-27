import { gql, useMutation, useQuery } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import { Text, View } from "@components/Themed";
import { compressImage } from "@config/media";
import { signImageUrl, deleteImageFromS3 } from "@config/requests";
import { uploadImage } from "@config/s3";
import { Avatar } from "@rneui/themed";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { useContext, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { showMessage } from "react-native-flash-message";

const meQuery = gql`
  query Query {
    me {
      id
      userName
      avatar
    }
  }
`;

const updateMutation = gql`
  mutation UpdateUser($avatar: String) {
    UpdateUser(avatar: $avatar) {
      id
    }
  }
`;

function EditAvatarScreen() {
  const { data: gqlData } = useQuery(meQuery);
  const [updateFunction] = useMutation(updateMutation);
  const [imageUri, setImageUri] = useState(gqlData?.me?.avatar);
  const { httpLinkUrl } = useContext(GlobalContext);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        // Use Promise.all to wait for all asynchronous operations to complete
        const fileName = result.assets[0].uri.split("/").pop();
        const fileType = fileName?.split(".").pop();
        const res = await signImageUrl(httpLinkUrl, fileName, fileType);
        if (res.ok) {
          const { data } = res;
          const { signedUrl, objectUrl } = data;
          setImageUri(objectUrl);
          // 通过 signedUrl 上传图片
          const compressedAsset = await compressImage(result.assets[0].uri);
          await uploadImage(signedUrl, fileType, compressedAsset);

          // 删除原来的图片
          if (gqlData?.me?.avatar) {
            const res = await deleteImageFromS3(
              httpLinkUrl,
              gqlData?.me?.avatar,
            );
            if (!res.ok) {
              console.log("delete image error", res.error);
            }
          }

          // 上传成功后，更新数据库
          const variables = {
            avatar: objectUrl,
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
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Edit Avatar",
            headerTitleAlign: "center",
          }}
        />
        <View style={styles.content}>
          {gqlData?.me?.avatar ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <Avatar
              size={64}
              rounded
              title={gqlData?.me?.userName?.slice(0, 2) ?? ""}
              containerStyle={styles.avatar}
            />
          )}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity style={styles.reserveButton} onPress={pickImage}>
              <Text style={styles.reserveButtonText}>Change Avatar</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 30,
    backgroundColor: "orange",
  },
  reserveButton: {
    padding: 5,
    borderRadius: 30,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  reserveButtonText: {
    color: "gray",
    fontSize: 12,
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default EditAvatarScreen;
