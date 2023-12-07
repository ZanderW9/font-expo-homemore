import { Text, View } from "@components/Themed";
import { StyleSheet } from "react-native";

function DetailPart4(data: any) {
  const deviceType = data.deviceType;
  const standoutType = data.standoutType;
  const safetyDeviceType = data.safetyDeviceType;

  const amenities = [...deviceType, ...standoutType, ...safetyDeviceType];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facilities/Services</Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {amenities.map((amenity: any, index: number) => {
          if (amenity.length > 5) {
            amenity = amenity.replace(/([A-Z])/g, " $1").trim();
          }
          return (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                marginBottom: 5,
              }}
            >
              <View
                style={{
                  padding: 5,
                  borderWidth: 1,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  borderRadius: 15,
                  marginRight: 5,
                  width: "auto",
                }}
              >
                <Text style={{ fontSize: 14, color: "gray" }}>{amenity}</Text>
              </View>
            </View>
          );
        })}
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
});

export default DetailPart4;
