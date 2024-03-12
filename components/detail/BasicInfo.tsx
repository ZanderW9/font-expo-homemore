import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function BasicInfo(props: any) {
  const placeTypeDir = {
    apartment: "Apartment",
    house: "House",
    hotel: "Hotel",
  };

  const rentTypeDir = {
    aRoom: "A Separate Room",
    anEntirePlace: "Entire Place",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.placeType}>
        {placeTypeDir[props.placeType]} · {rentTypeDir[props.rentType]}
      </Text>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.description}>{props.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  placeType: {
    fontSize: 13,
    color: "gray",
    marginBottom: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 3,
  },
  description: {
    fontSize: 16,
    marginBottom: 3,
  },
});

export default BasicInfo;
