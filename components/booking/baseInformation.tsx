import { Text, View } from "@components/Themed";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

function BaseInfo(data: any) {
  let rentType = "";
  if (data.rentType === "ARoom") {
    rentType = "A Separate Room";
  } else {
    rentType = "An Entire Place";
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.1)",
          padding: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            width: "30%",
            backgroundColor: "rgba(0,0,0,0.1)",
            aspectRatio: 1,
            borderRadius: 10,
          }}
        >
          <Image
            source={{ uri: data.image.smallUrl }}
            placeholder={{ thumbhash: data.image.thumbhash }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "70%",
            paddingLeft: 10,
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.price}>${data.price} / day</Text>
          <Text style={styles.placeType}>
            {data.placeType} · {rentType}
          </Text>
        </View>
      </View>
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
    marginBottom: 3,
    height: 1,
    width: "100%",
  },
  placeType: {
    fontSize: 13,
    color: "gray",
  },
  title: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
});

export default BaseInfo;
