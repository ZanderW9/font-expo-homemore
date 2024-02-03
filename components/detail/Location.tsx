import { Text, View, Pressable } from "@components/Themed";
import MapView from "@components/map/MapView";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

const Location = (props: any) => {
  const { listing } = props;
  const { coordinate } = listing;
  const lat = coordinate?.lat || 0;
  const lng = coordinate?.lng || 0;
  const address = listing.address || {};
  const center = {
    lat,
    lng,
    latDelta: 0.0922,
    lngDelta: 0.0421,
  };
  const [copyAddress, setCopyAddress] = useState(
    `${address?.city} ${address?.postCode}, ${address?.state} ${address?.country?.toUpperCase()}`,
  );

  const copyHandler = async () => {
    setCopyAddress(
      `${address?.city} ${address?.postCode}, ${address?.state} ${address?.country?.toUpperCase()}`,
    );
    await Clipboard.setStringAsync(copyAddress);
    showMessage({
      message: "Address Copied",
      type: "success",
      duration: 2000,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
      <Text style={styles.address} onPress={copyHandler}>
        {address?.city} {address?.postCode}, {address?.state}{" "}
        {address?.country?.toUpperCase()}
      </Text>

      <Pressable
        style={styles.mapWrapper}
        onPress={() =>
          router.navigate({
            pathname: "/detailMap",
            params: { lat, lng, id: listing.id, price: listing.price },
          })
        }
      >
        {coordinate?.lat && (
          <MapView
            center={center}
            setCenter={() => {}}
            listings={[listing]}
            refetch={() => {}}
            scrollEnabled={false} // 设置不可拖动
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
};

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
  address: {
    fontSize: 15,
    paddingVertical: 5,
  },
});

export default Location;
