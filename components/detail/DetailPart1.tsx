import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function DetailPart1(data: any) {
  let rentType = "";
  if (data.data.rentType === "ARoom") {
    rentType = "A Separate Room";
  } else {
    rentType = "An Entire Place";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeType}>
        {data.data.placeType} · {rentType}
      </Text>
      <Text style={styles.title}>{data.data.title}</Text>
      <Text style={styles.description}>{data.data.description}</Text>
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
    marginTop: 20,
    marginHorizontal: 10,
  },
  separator: {
    marginBottom: 3,
    height: 1,
    width: "100%",
  },
  placeType: {
    fontSize: 13,
    color: "gray",
    marginBottom: 3,
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: "black",
    marginBottom: 3,
  },
});

export default DetailPart1;
