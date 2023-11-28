import { Text, View } from "@components/Themed";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";

function DetailPart2(data: any) {
  const PAGE_WIDTH = Dimensions.get("window").width * 0.95;

  let rentType = "";
  if (data.rentType === "ARoom") {
    rentType = "A Separate Room";
  } else {
    rentType = "An Entire Place";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 3,
          marginTop: 3,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: PAGE_WIDTH * 0.25,
          }}
        >
          <Feather name="home" size={24} color="black" />
          <Text style={styles.iconDescription}>
            {data.bedRooms ? data.bedRooms : 0} Bedrooms
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: PAGE_WIDTH * 0.25,
          }}
        >
          <MaterialCommunityIcons
            name="bed-king-outline"
            size={24}
            color="black"
          />
          <Text style={styles.iconDescription}>
            {data.bed ? data.bed : 0} Beds
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: PAGE_WIDTH * 0.25,
          }}
        >
          <MaterialCommunityIcons name="toilet" size={24} color="black" />
          <Text style={styles.iconDescription}>
            {data.bathRooms ? data.bathRooms : 0} Bathrooms
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: PAGE_WIDTH * 0.25,
          }}
        >
          <MaterialCommunityIcons
            name="account-group-outline"
            size={24}
            color="black"
          />
          <Text style={styles.iconDescription}>
            {data.guests ? data.guests : 0} Guests
          </Text>
        </View>
      </View>
      <View style={styles.boxWrapper}>
        <View style={styles.box}>
          <Text style={styles.boxText}>{data.placeType}</Text>
          <Text style={styles.boxText}>{rentType}</Text>
          <Text style={styles.boxText}>${data.price ? data.price : 0}/day</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxText}>Preferred Guests: </Text>
          <Text style={styles.boxText}>
            {data.guestType.map((item: any, index: number) => item).join(", ")}
          </Text>
        </View>
      </View>
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
  iconDescription: {
    fontSize: 12,
    color: "black",
  },
  boxWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 10,
    width: "100%",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 3,
    width: "35%",
    height: 80,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
  },
  boxText: {
    fontSize: 12,
    color: "black",
    padding: 2,
  },
});

export default DetailPart2;
