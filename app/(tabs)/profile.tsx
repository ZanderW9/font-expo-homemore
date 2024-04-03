import { gql, useQuery } from "@apollo/client";
import { ListItem, Avatar } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import NotLogIn from "@/components/NotLogIn";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "@/components/Themed";
import { LinkPreview } from "@/components/inbox/LinkPreview";
import { updateAppMeta } from "@/config/state/appMetaSlice";
import { RootState, useDispatch, useSelector } from "@/config/state/store";
import { clearLocalItems } from "@/config/storageManager";
import { useThemedColors } from "@/constants/theme";

const meQuery = gql`
  query Query {
    me {
      id
      userName
      avatar
      createdAt
    }
  }
`;

function TabProfileScreen() {
  const colors = useThemedColors();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.appMeta);

  const { data } = useQuery(meQuery);

  const logOutHandler = async () => {
    await clearLocalItems();
    dispatch(updateAppMeta({ user: null, token: null }));
    router.replace("/profile");
  };

  const myPostHandler = async () => {
    router.navigate("/managepost");
  };

  const myOrderHandler = async () => {
    router.navigate("/manageorder");
  };

  const AccountHandler = async () => {
    router.navigate("/user/accountsecurity");
  };

  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        theme={{ background: "back2" }}
      >
        {!token && (
          <SafeAreaView style={{ flex: 1 }} theme={{ background: "back2" }}>
            <NotLogIn
              title="Find your next home from here!"
              subtitle="Sign in to publish or order a listing"
            />
          </SafeAreaView>
        )}

        {token && (
          <View theme={{ background: "back2" }}>
            <Pressable
              style={styles.userInfo}
              onPress={() => {
                router.navigate("/user/user-info");
              }}
            >
              {data?.me?.avatar ? (
                <Avatar
                  size={64}
                  rounded
                  source={{ uri: data?.me?.avatar }}
                  containerStyle={styles.avatar}
                >
                  <Avatar.Accessory size={20} />
                </Avatar>
              ) : (
                <Avatar
                  size={64}
                  rounded
                  title={data?.me?.userName?.slice(0, 2) ?? ""}
                  containerStyle={styles.avatar}
                >
                  <Avatar.Accessory size={20} />
                </Avatar>
              )}

              <View style={styles.usernameWrapper}>
                <Text style={styles.username}>{data?.me?.userName}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Joined on {data?.me?.createdAt?.slice(0, 10)}
                </Text>
              </View>
            </Pressable>

            <ListItem
              containerStyle={{ backgroundColor: colors.back1, marginTop: 10 }}
              onPress={() => {
                router.navigate("/listing/step-1");
              }}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text>Create Listing</Text>
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={{ backgroundColor: colors.back1, marginTop: 10 }}
              onPress={myPostHandler}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text>Manage Listing</Text>
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={{ backgroundColor: colors.back1, marginTop: 1 }}
              onPress={myOrderHandler}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text>My Order</Text>
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={{ backgroundColor: colors.back1, marginTop: 10 }}
              onPress={() => {
                router.navigate("/profile/settings");
              }}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text>Settings</Text>
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={{ backgroundColor: colors.back1 }}
              onPress={AccountHandler}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text>Account and Security</Text>
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>

            <ListItem
              containerStyle={{ backgroundColor: colors.back1, marginTop: 10 }}
              onPress={logOutHandler}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text>Log Out</Text>
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        )}

        <View
          style={{
            margin: 10,
            marginBottom: 0,
            backgroundColor: "transparent",
          }}
        >
          <LinkPreview text="https//homemore.com.au" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  title: {
    fontSize: 18,
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "white",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.25,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 100,
    marginRight: 20,
    backgroundColor: "#F3EED9",
  },
  usernameWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  username: {
    fontSize: 16,
  },
});

export default TabProfileScreen;
