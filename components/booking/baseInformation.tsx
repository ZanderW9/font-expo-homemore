import { Text, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

function BaseInfo(props: any) {
  const colors = useThemedColors();

  const placeTypeDir = {
    apartment: "Apartment",
    house: "House",
    hotel: "Hotel",
  };
  const rentTypeDir = {
    aRoom: "A Separate Room",
    anEntirePlace: "Entire Place",
  };
  const address = `${props.address.city}, ${props.address.state}, ${props.address.country}, ${props.address.postCode}`;

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: colors.border1,
          padding: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            width: "30%",
            backgroundColor: colors.back2,
            aspectRatio: 1,
            borderRadius: 10,
          }}
        >
          <Image
            source={{ uri: props?.image?.smallUrl }}
            placeholder={{ thumbhash: props?.image?.thumbhash }}
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
            justifyContent: "flex-start",
          }}
        >
          <Text style={styles.title}>{props.title}</Text>
          <Text style={[styles.description, { color: colors.textSub1Reverse }]}>
            {props.description}
          </Text>

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Text style={[styles.placeType, { color: colors.textSub1 }]}>
              {address}
            </Text>
            <Text style={[styles.placeType, { color: colors.textSub1 }]}>
              {placeTypeDir[props.placeType]} · {rentTypeDir[props.rentType]}
            </Text>
          </View>
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
  placeType: {
    fontSize: 13,
  },
  title: {
    fontSize: 14,
  },
  description: {
    fontSize: 14,
  },
  address: {
    fontSize: 14,
  },
});

export default BaseInfo;
