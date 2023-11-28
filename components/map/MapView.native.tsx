import React, { memo } from "react";
import MapView, { Marker } from "react-native-maps";

function MapScreen(props) {
  const { center, scrollEnabled } = props;

  const currentLocationMarker = {
    latitude: center.lat,
    longitude: center.lng,
  };

  return (
    <MapView
      provider="google"
      googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}
      initialRegion={{
        latitude: center.lat,
        longitude: center.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      scrollEnabled={scrollEnabled}
      style={{ width: "100%", height: "100%", flex: 1 }}
    >
      {/* 标记当前位置 */}
      <Marker coordinate={currentLocationMarker} title="Current Location" />
    </MapView>
  );
}

export default memo(MapScreen);
