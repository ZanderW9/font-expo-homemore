import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function DetailPart2(data: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> - THE END - </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
    paddingTop: 20,
  },
  title: {
    fontSize: 10,
    color: "gray",
  },
});

export default DetailPart2;
