import { gql, useQuery } from "@apollo/client";
import { Text, ScrollView } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { ListItem, Avatar } from "@rneui/themed";
import { Stack, router } from "expo-router";
import { StyleSheet } from "react-native";

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
  const colors = useThemedColors();
  const { data } = useQuery(meQuery);

  const updateAvatarHandler = () => {
    router.navigate({
      pathname: "/user/update-avatar",
      params: { userId: data?.me?.id },
    });
  };

  const updateNameHandler = () => {
    router.navigate({
      pathname: "/user/update-name",
      params: { userId: data?.me?.id },
    });
  };

  const updateEmailHandler = () => {
    router.navigate({
      pathname: "/user/update-email",
      params: { userId: data?.me?.id },
    });
  };

  const updatePhoneHandler = () => {
    router.navigate({
      pathname: "/user/update-phone",
      params: { userId: data?.me?.id },
    });
  };

  const updateGenderHandler = () => {
    router.navigate({
      pathname: "/user/update-gender",
      params: { userId: data?.me?.id },
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      theme={{ background: "back2" }}
    >
      <Stack.Screen
        options={{
          title: "Personal Information",
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
        containerStyle={{
          backgroundColor: colors.back1,
          borderColor: colors.border1,
          borderBottomWidth: 0.5,
        }}
        bottomDivider
        onPress={updateAvatarHandler}
      >
        <ListItem.Content style={styles.subtitleWrapper}>
          <ListItem.Title>
            <Text>Avatar</Text>
          </ListItem.Title>
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
                titleStyle={{ color: colors.textSub1Reverse }}
                containerStyle={styles.avatar}
              />
            )}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        containerStyle={{
          backgroundColor: colors.back1,
          borderColor: colors.border1,
          borderBottomWidth: 0.5,
        }}
        bottomDivider
        onPress={updateNameHandler}
      >
        <ListItem.Content style={styles.subtitleWrapper}>
          <ListItem.Title>
            <Text>Name</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            <Text theme={{ color: "textSub1" }}> {data?.me?.userName}</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        containerStyle={{
          backgroundColor: colors.back1,
          borderColor: colors.border1,
          borderBottomWidth: 0.5,
        }}
        bottomDivider
        onPress={updateEmailHandler}
      >
        <ListItem.Content style={styles.subtitleWrapper}>
          <ListItem.Title>
            <Text>Email</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            <Text theme={{ color: "textSub1" }}>{data?.me?.email}</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        containerStyle={{
          backgroundColor: colors.back1,
          borderColor: colors.border1,
          borderBottomWidth: 0.5,
        }}
        bottomDivider
        onPress={updatePhoneHandler}
      >
        <ListItem.Content style={styles.subtitleWrapper}>
          <ListItem.Title>
            <Text>Phone</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            <Text theme={{ color: "textSub1" }}>{data?.me?.phone}</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        containerStyle={{
          backgroundColor: colors.back1,
          borderColor: colors.border1,
          borderBottomWidth: 0.5,
        }}
        bottomDivider
        onPress={updateGenderHandler}
      >
        <ListItem.Content style={styles.subtitleWrapper}>
          <ListItem.Title>
            <Text>Gender</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            <Text theme={{ color: "textSub1" }}>{data?.me?.gender}</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </ScrollView>
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

export default EditProfileScreen;
