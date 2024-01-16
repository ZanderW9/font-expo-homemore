import { View, Text } from "@components/Themed";
import { Button } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export const signInHandler = async () => {
  router.push("/signin");
};

export const signUpHandler = async () => {
  router.push("/signup");
};

function NotLogIn(data: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subtitle}>{data.subtitle}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "80%",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Button
          title="Sign In"
          onPress={signInHandler}
          buttonStyle={{
            backgroundColor: "rgb(236, 76, 96)",
            padding: 15,
            paddingHorizontal: 16,
            borderRadius: 7,
            marginTop: 40,
          }}
        />
        <Button
          title="Sign Up"
          type="outline"
          onPress={signUpHandler}
          buttonStyle={{
            borderColor: "rgb(236, 76, 96)",
            padding: 15,
            borderRadius: 7,
            marginTop: 40,
          }}
          titleStyle={{
            color: "rgb(236, 76, 96)",
            fontSize: 18,
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
    backgroundColor: "#f5f5f5",
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
