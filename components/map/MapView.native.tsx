import React, { memo } from "react";
import MapView from "react-native-maps";

function MapScreen(props) {
  const { center } = props;
  return (
    <MapView
      provider="google"
      googleMapsApiKey="AIzaSyCv63CzdTG2txBuvQKry0N7Tt5PkoGA9kU"
      initialRegion={{
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      style={{ width: "100%", height: "100%", flex: 1 }}
    />
  );
}

export default memo(MapScreen);
