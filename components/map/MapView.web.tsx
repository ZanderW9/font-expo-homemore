import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React, { memo } from "react";

function MapScreen(props) {
  const { center } = props;

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCv63CzdTG2txBuvQKry0N7Tt5PkoGA9kU" // Replace with your Google Maps API key
    >
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
        center={center}
        zoom={13}
      />
    </LoadScript>
  );
}

export default memo(MapScreen);
