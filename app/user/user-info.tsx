import { gql, useQuery } from "@apollo/client";
import { View } from "@components/Themed";
import { ListItem, Avatar } from "@rneui/themed";
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

function EditProfileScreen() {
  const { data } = useQuery(meQuery);

  const updateAvatarHandler = () => {
    router.push({
      pathname: "/user/update-avatar",
      params: { userId: data?.me?.id },
    });
  };

  const updateNameHandler = () => {
    router.push({
      pathname: "/user/update-name",
      params: { userId: data?.me?.id },
    });
  };

  const updateEmailHandler = () => {
    router.push({
      pathname: "/user/update-email",
      params: { userId: data?.me?.id },
    });
  };

  const updatePhoneHandler = () => {
    router.push({
      pathname: "/user/update-phone",
      params: { userId: data?.me?.id },
    });
  };

  const updateGenderHandler = () => {
    router.push({
      pathname: "/user/update-gender",
      params: { userId: data?.me?.id },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Personal Information",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            animation: "slide_from_right",
          }}
        />
        <ListItem onPress={updateAvatarHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Avatar</ListItem.Title>
            <ListItem.Subtitle>
              {data?.me?.avatar ? (
                <Avatar
                  size={64}
                  rounded
                  source={{ uri: data?.me?.avatar }}
                  containerStyle={styles.avatar}
                />
              ) : (
                <Avatar
                  size={64}
                  rounded
                  title={data?.me?.userName?.slice(0, 2) ?? ""}
                  containerStyle={styles.avatar}
                />
              )}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <View
          style={styles.separatorThin}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <ListItem onPress={updateNameHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Name</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {data?.me?.userName}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <View
          style={styles.separatorThin}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <ListItem onPress={updateEmailHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Email</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {data?.me?.email}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <View
          style={styles.separatorThin}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <ListItem onPress={updatePhoneHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Phone</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {data?.me?.phone}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <View
          style={styles.separatorThin}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        <ListItem onPress={updateGenderHandler}>
          <ListItem.Content style={styles.subtitleWrapper}>
            <ListItem.Title>Gender</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {data?.me?.gender}
            </ListItem.Subtitle>
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
    borderRadius: 30,
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

export default EditProfileScreen;
