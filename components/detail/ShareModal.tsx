import { gql, useQuery, useMutation } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Divider } from "@rneui/themed";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useMemo, useCallback } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const meQuery = gql`
  query Query {
    me {
      id
    }
  }
`;

const modifyPublishMutation = gql`
  mutation Mutation($modifyPublishId: String!, $published: Boolean!) {
    modifyPublish(id: $modifyPublishId, published: $published) {
      id
    }
  }
`;

function ShareModal(props: any) {
  const colors = useThemedColors();
  const snapPoints = useMemo(() => ["30%"], []);
  const copyLink = `https://homemore.com.au/detail/${props.listingId}`;
  const [modifyPublishFunction] = useMutation(modifyPublishMutation);

  const copyLinkHandler = async () => {
    await Clipboard.setStringAsync(copyLink);
    props.bottomSheetModalRef.current?.close();
  };

  const listingId = props.listingId;
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

  const { data } = useQuery(meQuery);
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

  const editHandler = () => {
    router.navigate({
      pathname: "/listing/step-1",
      params: { listingId },
    });
    props.bottomSheetModalRef.current?.close();
  };

  const unpublishHandler = () => {
    modifyPublishFunction({
      variables: {
        modifyPublishId: listingId,
        published: false,
      },
      refetchQueries: [{ query: meQuery }],
    });
    props.bottomSheetModalRef.current?.close();
    router.back();
  };

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={props.bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: colors.back1 }}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Share to</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconWrapper}>
                <AntDesign
                  name="wechat"
                  size={40}
                  color={colors.text}
                  onPress={openWeChat}
                />
                <Text style={styles.title}>WeChat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrapper}>
                <AntDesign
                  name="QQ"
                  size={40}
                  color={colors.text}
                  onPress={openQQ}
                />
                <Text style={styles.title}>QQ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrapper}>
                <AntDesign
                  name="facebook-square"
                  size={40}
                  color={colors.text}
                  onPress={openFacebook}
                />
                <Text style={styles.title}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Divider width={1} color="red" />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconWrapper}>
                <Ionicons
                  name="copy-outline"
                  size={40}
                  color={colors.text}
                  onPress={copyLinkHandler}
                />
                <Text style={styles.title}>Copy Link</Text>
              </TouchableOpacity>

              {data?.me?.id === props.userId && (
                <TouchableOpacity style={styles.iconWrapper}>
                  <Ionicons
                    name="create-outline"
                    size={40}
                    color={colors.text}
                    onPress={editHandler}
                  />
                  <Text style={styles.title}>Edit</Text>
                </TouchableOpacity>
              )}

              {data?.me?.id === props.userId && (
                <TouchableOpacity style={styles.iconWrapper}>
                  <Ionicons
                    name="trash-outline"
                    size={40}
                    color={colors.text}
                    onPress={unpublishHandler}
                  />
                  <Text style={styles.title}>Unpublish</Text>
                </TouchableOpacity>
              )}

              {data?.me?.id !== props.userId && (
                <TouchableOpacity style={styles.iconWrapper}>
                  <Ionicons
                    name="warning-outline"
                    size={40}
                    color={colors.text}
                  />
                  <Text style={styles.title}>Report</Text>
                </TouchableOpacity>
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
});

export default ShareModal;
