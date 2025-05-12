import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

function detailScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>this is detail screen</Text>
    </View>
  );
}

export default detailScreen;
