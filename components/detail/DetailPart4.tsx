import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function DetailPart4() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facilities/Services</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  separator: {
    marginTop: 10,
    height: 1,
    width: "100%",
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
  },
});

export default DetailPart4;
