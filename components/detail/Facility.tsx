import { Text, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { StyleSheet } from "react-native";

function Facility(data: any) {
  const colors = useThemedColors();
  const device = data.device;
  const safetyDevice = data.safetyDevice;

  const amenitiesDict = {
    "Wi-Fi": "Wi-Fi",
    TV: "TV",
    kitchen: "Kitchen",
    washingMachine: "Washing Machine",
    airConditioner: "Air Conditioner",
    parking: "Parking",
    workSpace: "Work Space",
    exerciseEquipment: "Exercise Equipment",
    bathTub: "Bath Tub",
    smokeAlarm: "Smoke Alarm",
    firstAidKit: "First Aid Kit",
    fireExtinguisher: "Fire Extinguisher",
    carbonMonoxideAlarm: "Carbon Monoxide Alarm",
    fridge: "Fridge",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amenities/Services</Text>

      <Text style={{ fontSize: 16, color: "gray", marginBottom: 5 }}>
        Basic Amenities
      </Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {device.map((amenity: any, index: number) => {
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
                  borderRadius: 15,
                  marginRight: 5,
                  minWidth: 50,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: colors.textSub1Reverse }}>
                  {amenitiesDict[amenity]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text
        style={{ fontSize: 16, color: colors.textSub1Reverse, marginBottom: 5 }}
      >
        Safety Devices
      </Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {safetyDevice.map((amenity: any, index: number) => {
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
                  borderRadius: 15,
                  marginRight: 5,
                  minWidth: 50,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: colors.textSub1Reverse }}>
                  {amenitiesDict[amenity]}
                </Text>
              </View>
            </View>
          );
        })}
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
});

export default Facility;
