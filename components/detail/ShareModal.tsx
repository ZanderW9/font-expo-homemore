import { gql, useQuery, useMutation } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useMemo, useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";

const meQuery = gql`
  query Query {
    me {
      id
    }
  }
`;

const modifyPublishMutation = gql`
  mutation Mutation($modifyPublishId: Int!, $published: Boolean!) {
    modifyPublish(id: $modifyPublishId, published: $published) {
      id
    }
  }
`;

function ShareModal(data: any) {
  const snapPoints = useMemo(() => ["30%"], []);
  const copyLink = `https://192.168.50.242:8081/detail/${data.listingId}`;
  const [modifyPublishFunction] = useMutation(modifyPublishMutation);

  const copyLinkHandler = async () => {
    await Clipboard.setStringAsync(copyLink);
    data.bottomSheetModalRef.current?.close();
  };

  const listingId = parseInt(data.listingId);
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

  const { data: gqlData } = useQuery(meQuery);

  const openWeChat = async () => {
    const isInstalled = await Linking.canOpenURL("weixin://");

    if (isInstalled) {
      copyLinkHandler();
      Linking.openURL("weixin://");
    } else {
      alert("WeChat is not installed on your device.");
    }
  };

  const openQQ = async () => {
    const isInstalled = await Linking.canOpenURL("mqq://");

    if (isInstalled) {
      copyLinkHandler();
      Linking.openURL("mqq://");
    } else {
      alert("QQ is not installed on your device.");
    }
  };

  const openFacebook = async () => {
    const isInstalled = await Linking.canOpenURL("fb://");

    if (isInstalled) {
      copyLinkHandler();
      Linking.openURL("fb://");
    } else {
      alert("Facebook is not installed on your device.");
    }
  };

  const openWeibo = async () => {
    const isInstalled = await Linking.canOpenURL("sinaweibo://splash");

    if (isInstalled) {
      copyLinkHandler();
      Linking.openURL("sinaweibo://splash");
    } else {
      alert("Weibo is not installed on your device.");
    }
  };

  const editHandler = () => {
    router.push({ pathname: "/createlisting", params: { listingId } });
    data.bottomSheetModalRef.current?.close();
  };

  const unpublishHandler = () => {
    modifyPublishFunction({
      variables: {
        modifyPublishId: listingId,
        published: false,
      },
      refetchQueries: [{ query: meQuery }],
    });
    data.bottomSheetModalRef.current?.close();
    router.back();
  };

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={data.bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Share to</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <AntDesign
                  name="wechat"
                  size={40}
                  color="black"
                  onPress={openWeChat}
                />
                <Text style={styles.title}>WeChat</Text>
              </View>
              <View style={styles.iconWrapper}>
                <AntDesign name="QQ" size={40} color="black" onPress={openQQ} />
                <Text style={styles.title}>QQ</Text>
              </View>
              <View style={styles.iconWrapper}>
                <AntDesign
                  name="facebook-square"
                  size={40}
                  color="black"
                  onPress={openFacebook}
                />
                <Text style={styles.title}>Facebook</Text>
              </View>

              <View style={styles.iconWrapper}>
                <AntDesign
                  name="weibo"
                  size={40}
                  color="black"
                  onPress={openWeibo}
                />
                <Text style={styles.title}>WeiBo</Text>
              </View>
            </View>
          </ScrollView>

          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.iconContainer}>
              <View style={styles.iconWrapper}>
                <Ionicons
                  name="copy-outline"
                  size={40}
                  color="black"
                  onPress={copyLinkHandler}
                />
                <Text style={styles.title}>Copy Link</Text>
              </View>

              {gqlData?.me?.id === data.userId && (
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name="create-outline"
                    size={40}
                    color="black"
                    onPress={editHandler}
                  />
                  <Text style={styles.title}>Edit</Text>
                </View>
              )}

              {gqlData?.me?.id === data.userId && (
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name="trash-outline"
                    size={40}
                    color="black"
                    onPress={unpublishHandler}
                  />
                  <Text style={styles.title}>Unpublish</Text>
                </View>
              )}

              {gqlData?.me?.id !== data.userId && (
                <View style={styles.iconWrapper}>
                  <Ionicons name="warning-outline" size={40} color="black" />
                  <Text style={styles.title}>Report</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "flex-start",
    padding: 5,
  },
  title: {
    fontSize: 14,
    color: "gray",
    alignSelf: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 5,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    padding: 5,
  },
  separator: {
    height: 1,
    width: "100%",
  },
});

export default ShareModal;
