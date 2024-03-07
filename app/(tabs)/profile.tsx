import { gql } from "@apollo/client";
import { ListItem, Avatar } from "@rneui/themed";
import { router, usePathname } from "expo-router";
import React, { useEffect, useContext } from "react";
import { StyleSheet } from "react-native";

import { GlobalContext } from "@/app/_layout";
import NotLogIn from "@/components/NotLogIn";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "@/components/Themed";
import { LinkPreview } from "@/components/inbox/LinkPreview";
import { clearLocalItems, getLocalItem } from "@/config/storageManager";
import useCachedQuery from "@/config/useCachedQuery";
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
  const {
    setIsLoggedIn,
    isLoggedIn,
    setToken,
    httpLinkUrl,
    setApolloClient,
    setMe,
  } = useContext(GlobalContext);

  const { data: gqlData } = useCachedQuery(meQuery, usePathname());

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getLocalItem("userToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const logOutHandler = async () => {
    await clearLocalItems();
    setIsLoggedIn(false);
    setToken(null);
    setApolloClient("", httpLinkUrl);
    setMe({
      id: "",
      userName: "",
      avatar: "",
    });
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
        {!isLoggedIn && (
          <SafeAreaView style={{ flex: 1 }} theme={{ background: "back2" }}>
            <NotLogIn
              title="Find your next home from here!"
              subtitle="Sign in to publish or order a listing"
            />
          </SafeAreaView>
        )}

        {isLoggedIn && (
          <View theme={{ background: "back2" }}>
            <Pressable
              style={styles.userInfo}
              onPress={() => {
                router.navigate("/user/user-info");
              }}
            >
              {gqlData?.me?.avatar ? (
                <Avatar
                  size={64}
                  rounded
                  source={{ uri: gqlData?.me?.avatar }}
                  containerStyle={styles.avatar}
                >
                  <Avatar.Accessory size={20} />
                </Avatar>
              ) : (
                <Avatar
                  size={64}
                  rounded
                  title={gqlData?.me?.userName?.slice(0, 2) ?? ""}
                  containerStyle={styles.avatar}
                >
                  <Avatar.Accessory size={20} />
                </Avatar>
              )}

              <View style={styles.usernameWrapper}>
                <Text style={styles.username}>{gqlData?.me?.userName}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Joined on {gqlData?.me?.createdAt?.slice(0, 10)}
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
