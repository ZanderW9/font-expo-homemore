import { gql, useQuery } from "@apollo/client";
import { View } from "@components/Themed";
import { ListItem } from "@rneui/themed";
import { Stack, router } from "expo-router";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";

const meQuery = gql`
  query Query {
    me {
      id
      userName
      email
      avatar
      phone
      gender
    }
  }
`;

function AccountAndSecurityScreen() {
  const { data } = useQuery(meQuery);

  const changePasswordHandler = () => {
    router.push({
      pathname: "/user/update-password",
    });
  };

  const terminateHandler = () => {
    router.push({
      pathname: "/user/terminate-account",
      params: { userId: data?.me?.id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Account and Security",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            animation: "slide_from_right",
          }}
        />

        <ListItem onPress={changePasswordHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Password</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <View
          style={styles.separatorThin}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <ListItem onPress={terminateHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Terminate Account</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  subtitleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtitle: {
    color: "gray",
    fontSize: 16,
  },
  separatorThin: {
    height: 1,
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "white",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 100,
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

export default AccountAndSecurityScreen;
