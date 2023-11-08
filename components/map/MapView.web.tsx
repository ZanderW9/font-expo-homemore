import { useASGet } from "@config/hooks/storage";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
  flex: 1,
};

const defaultCenter = { lat: -34.397, lng: 150.644 };

function MapScreen() {
  const { storedValue: initialLocation } = useASGet("userLocation");
  console.log("initialLocation:", initialLocation);
  const center = initialLocation
    ? {
        lat: initialLocation.coords.latitude,
        lng: initialLocation.coords.longitude,
      }
    : defaultCenter;
  console.log("center:", center);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCv63CzdTG2txBuvQKry0N7Tt5PkoGA9kU" // Replace with your Google Maps API key
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {/* Child components, like markers, info windows, etc. */}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MapScreen);
