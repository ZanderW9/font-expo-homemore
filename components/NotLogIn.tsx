import { View, Text } from "@components/Themed";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export const signInHandler = async () => {
  router.navigate("/signin");
};

export const signUpHandler = async () => {
  router.navigate("/signup");
};

function NotLogIn(data: any) {
  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subtitle}>{data.subtitle}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "80%",
        }}
        theme={{ background: "back2" }}
      >
        <Button
          title="Sign In"
          onPress={signInHandler}
          buttonStyle={{
            backgroundColor: "rgb(236, 76, 96)",
            height: 50,
            width: 100,
            borderRadius: 7,
            marginVertical: 40,
          }}
        />
        <Button
          title="Sign Up"
          type="outline"
          onPress={signUpHandler}
          buttonStyle={{
            borderColor: "rgb(236, 76, 96)",
            height: 50,
            width: 100,
            borderRadius: 7,
            marginVertical: 40,
          }}
          titleStyle={{
            color: "rgb(236, 76, 96)",
            alignSelf: "center",
            justifyContent: "center",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default NotLogIn;
