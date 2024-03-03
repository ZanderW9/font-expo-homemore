import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function BasicInfo(props: any) {
  let rentType = "";
  if (props.data.rentType === "aRoom") {
    rentType = "A Separate Room";
  } else if (props.data.rentType === "anEntirePlace") {
    rentType = "An Entire Place";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeType}>
        {props.data.placeType}· {rentType}
      </Text>
      <Text style={styles.title}>{props.data.title}</Text>
      <Text style={styles.description}>{props.data.description}</Text>
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
    marginBottom: 3,
  },
});

export default BasicInfo;
