import { gql, useMutation, useQuery } from "@apollo/client";
import { Text, View, ScrollView, TouchableOpacity } from "@components/Themed";
import { compressImage } from "@config/media";
import { signImageUrl, deleteImageFromS3 } from "@config/requests";
import { uploadImage } from "@config/s3";
import { useThemedColors } from "@constants/theme";
import { Avatar } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
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
  const colors = useThemedColors();
  const { data: gqlData } = useQuery(meQuery);
  const [updateFunction] = useMutation(updateMutation);
  const [imageUri, setImageUri] = useState(gqlData?.me?.avatar);
  const httpLinkUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

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
              showMessage({
                message: res.data,
                type: "danger",
              });
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
    } catch {
      showMessage({
        message: "Something went wrong",
        type: "danger",
      });
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      theme={{ background: "back2" }}
    >
      <Stack.Screen
        options={{
          title: "Edit Avatar",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          animation: "slide_from_right",
          headerTitleStyle: {
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.back1,
          },
        }}
      />
      <View style={styles.content} theme={{ background: "back2" }}>
        {gqlData?.me?.avatar ? (
          <Avatar
            size={64}
            rounded
            source={{ uri: imageUri }}
            containerStyle={styles.avatar}
          />
        ) : (
          <Avatar
            size={64}
            rounded
            title={gqlData?.me?.userName?.slice(0, 2) ?? ""}
            titleStyle={{
              fontSize: 100,
              color: colors.textSub1Reverse,
            }}
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
          theme={{ background: "back2" }}
        >
          <TouchableOpacity style={styles.reserveButton} onPress={pickImage}>
            <Text
              style={styles.reserveButtonText}
              theme={{ color: "textSub1" }}
            >
              Change Avatar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: "#F3EED9",
  },
  reserveButton: {
    padding: 10,
    borderRadius: 30,
    marginVertical: 20,
    borderWidth: 1,
  },
  reserveButtonText: {
    fontSize: 14,
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default EditAvatarScreen;
