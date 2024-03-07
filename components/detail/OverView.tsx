import { Text, View, ScrollView } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { StyleSheet, Dimensions } from "react-native";

function OverView(props: any) {
  const colors = useThemedColors();
  const PAGE_WIDTH = Dimensions.get("window").width * 0.95;

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
          <Feather name="home" size={24} color={colors.text} />
          <Text style={styles.iconDescription}>
            {props.bedRooms ? props.bedRooms : 0} Bedrooms
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
            color={colors.text}
          />
          <Text style={styles.iconDescription}>
            {props.bed ? props.bed : 0} Beds
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
          <MaterialCommunityIcons name="toilet" size={24} color={colors.text} />
          <Text style={styles.iconDescription}>
            {props.bathRooms ? props.bathRooms : 0} Bathrooms
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
            color={colors.text}
          />
          <Text style={styles.iconDescription}>
            {props.guests ? props.guests : 0} Guests
          </Text>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.boxWrapper}
      >
        {props.bedroomDetails?.map((bedroom: any, index: number) => (
          <View
            key={index}
            style={[
              styles.box,
              { width: PAGE_WIDTH * 0.35, borderColor: colors.border1 },
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: colors.text,
                textTransform: "capitalize",
                marginBottom: 5,
                textShadowColor: colors.border1,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}
            >
              Bedroom {index + 1}
            </Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={styles.boxText}>{bedroom.bed.bedCount}</Text>
              <Text style={styles.boxText}>{bedroom.bed.bedType}</Text>
              <Text style={styles.boxText}>
                {bedroom.bed.bedCount === 1 ? "bed" : "beds"}
              </Text>
            </View>
            {bedroom.bath && <Text style={styles.boxText}>With Bath</Text>}
            {bedroom.toilet && <Text style={styles.boxText}>With Toilet</Text>}
          </View>
        ))}
      </ScrollView>
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
  },
  boxWrapper: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
  },
  box: {
    marginBottom: 3,
    height: 90,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
  },
  boxText: {
    fontSize: 12,
    padding: 2,
  },
});

export default OverView;
