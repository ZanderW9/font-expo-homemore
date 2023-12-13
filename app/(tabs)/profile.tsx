import { gql, useMutation, useApolloClient } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import { View } from "@components/Themed";
import { clearLocalItems, getLocalItem } from "@config/storageManager";
import { ListItem } from "@rneui/themed";
import { router } from "expo-router";
import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const createListingMutation = gql`
  mutation Mutation {
    createListing {
      id
    }
  }
`;

function TabProfileScreen() {
  const client = useApolloClient();
  const { setIsLoggedIn, isLoggedIn } = useContext(GlobalContext);
  const [createListingFunction, { data }] = useMutation(createListingMutation);

  useEffect(() => {
    if (data?.createListing.id) {
      router.push({
        pathname: "/createlisting",
        params: { listingId: data?.createListing.id },
      });
    }
  }, [data]);

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

  const signInHandler = async () => {
    router.push("/signin");
  };

  const signUpHandler = async () => {
    router.push("/signup");
  };

  const logOutHandler = async () => {
    await clearLocalItems();
    setIsLoggedIn(false);
    client.resetStore();
    router.replace("/profile");
  };

  const createListingHandler = async () => {
    createListingFunction();
  };

  const myPostHandler = async () => {
    router.push("/managepost");
  };

  const myOrderHandler = async () => {
    router.push("/manageorder");
  };

  const changePasswordHandler = async () => {
    router.push("/changepassword");
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {!isLoggedIn && (
              <>
                <ListItem onPress={signUpHandler}>
                  <ListItem.Content>
                    <ListItem.Title>Sign Up</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={signInHandler}>
                  <ListItem.Content>
                    <ListItem.Title>Sign In</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </>
            )}

            {isLoggedIn && (
              <View style={styles.container}>
                <ListItem onPress={createListingHandler}>
                  <ListItem.Content>
                    <ListItem.Title>Create Listing</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={myPostHandler}>
                  <ListItem.Content>
                    <ListItem.Title>Manage Listing</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={myOrderHandler}>
                  <ListItem.Content>
                    <ListItem.Title>My Order</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={changePasswordHandler}>
                  <ListItem.Content>
                    <ListItem.Title>Change Password</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
                <ListItem onPress={logOutHandler}>
                  <ListItem.Content>
                    <ListItem.Title>Log Out</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 5,
  },
  title: {
    fontSize: 18,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
});

export default TabProfileScreen;
