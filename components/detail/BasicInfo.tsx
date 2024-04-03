import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function BasicInfo(props: any) {
  const placeTypeDir = {
    apartment: "Apartment",
    house: "House",
    unit: "Unit",
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
      <Text style={styles.time}>
        Create at{" "}
        {new Date(props.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </Text>
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
    fontSize: 16,
    color: "gray",
    marginBottom: 3,
    paddingBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 3,
    lineHeight: 24,
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 3,
    lineHeight: 24,
    paddingBottom: 10,
  },
  time: {
    fontSize: 13,
    color: "gray",
    marginBottom: 3,
    paddingBottom: 10,
  },
});

export default BasicInfo;
