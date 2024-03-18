import { gql, useQuery } from "@apollo/client";
import { SafeAreaView, Text } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { ListItem, Divider } from "@rneui/themed";
import { Stack, router } from "expo-router";
import { StyleSheet, ScrollView } from "react-native";

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
  const colors = useThemedColors();
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
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
      theme={{ background: "back2" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Account and Security",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: colors.back1,
            },
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />

        <ListItem
          onPress={changePasswordHandler}
          containerStyle={{ backgroundColor: colors.back1 }}
        >
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>
              <Text>Password</Text>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Divider width={0.5} color={colors.border1} />

        <ListItem
          onPress={terminateHandler}
          containerStyle={{ backgroundColor: colors.back1 }}
        >
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>
              <Text>Terminate Account</Text>
            </ListItem.Title>
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
