import { Text, View } from "@components/Themed";
import MapScreen from "@components/map/MapView";
import { router } from "expo-router";
import { StyleSheet, Pressable } from "react-native";

function DetailPart3(data: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <Pressable
        style={styles.mapWrapper}
        onPress={
          () =>
            router.push({
              pathname: "/detail/map",
              params: { lat: data.lat, lng: data.lng },
            })
          // router.push("/detail/map")
        }
      >
        {data.lat !== 0 && data.lng !== 0 && (
          <MapScreen
            center={{
              lat: data.lat,
              lng: data.lng,
              latDelta: 0.0922 / 3,
              lngDelta: 0.0421 / 3,
            }}
            scrollEnabled={false} // 设置不可拖动
            isFullScreen={false}
          />
        )}
      </Pressable>
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
  mapWrapper: {
    width: "100%",
    height: 200,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 10,
  },
});

export default DetailPart3;
