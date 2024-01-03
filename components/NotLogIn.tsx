import { View, Text } from "@components/Themed";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

function NotLogIn(data: any) {
  const gotoSigninHandler = () => {
    router.push("/signin");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={gotoSigninHandler}
      >
        <Text style={styles.reserveButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  reserveButton: {
    backgroundColor: "rgb(236, 76, 96)",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  reserveButtonText: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
  },
  textWrapper: {
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default NotLogIn;
