import { Text, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";

function PreferredRoomer(props: any) {
  const colors = useThemedColors();
  const PAGE_WIDTH = Dimensions.get("window").width * 0.95;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferred Roomer</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {props.guestType?.includes("nonSmoker") && (
          <View
            style={{
              marginVertical: 10,
              justifyContent: "flex-start",
              backgroundColor: "transparent",
              width: PAGE_WIDTH * 0.45,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="smoke-free" size={30} color={colors.text} />
            <Text style={styles.iconDescription}>non-smoker</Text>
          </View>
        )}

        {props.guestType?.includes("withoutPet") && (
          <View
            style={{
              marginVertical: 10,
              justifyContent: "flex-start",
              backgroundColor: "transparent",
              width: PAGE_WIDTH * 0.45,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="dog-side-off"
              size={30}
              color={colors.text}
            />
            <Text style={styles.iconDescription}>without pet</Text>
          </View>
        )}

        {props.guestType?.includes("family") && (
          <View
            style={{
              marginVertical: 10,
              justifyContent: "flex-start",
              backgroundColor: "transparent",
              width: PAGE_WIDTH * 0.45,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="family-restroom"
              size={30}
              color={colors.text}
            />
            <Text style={styles.iconDescription}>family</Text>
          </View>
        )}

        {props.guestType?.includes("couple") && (
          <View
            style={{
              marginVertical: 10,
              justifyContent: "flex-start",
              backgroundColor: "transparent",
              width: PAGE_WIDTH * 0.45,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="heart-multiple-outline"
              size={30}
              color={colors.text}
            />
            <Text style={styles.iconDescription}>Couple</Text>
          </View>
        )}

        {props.guestType?.includes("male") && (
          <View
            style={{
              marginVertical: 10,
              justifyContent: "flex-start",
              backgroundColor: "transparent",
              width: PAGE_WIDTH * 0.45,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="male" size={30} color={colors.text} />
            <Text style={styles.iconDescription}>Male</Text>
          </View>
        )}

        {props.guestType?.includes("female") && (
          <View
            style={{
              marginVertical: 10,
              justifyContent: "flex-start",
              backgroundColor: "transparent",
              width: PAGE_WIDTH * 0.45,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="female" size={30} color={colors.text} />
            <Text style={styles.iconDescription}>Female</Text>
          </View>
        )}
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
    marginVertical: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 3,
  },
  iconDescription: {
    fontSize: 12,
    paddingLeft: 5,
  },
  boxWrapper: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
  },
});

export default PreferredRoomer;
