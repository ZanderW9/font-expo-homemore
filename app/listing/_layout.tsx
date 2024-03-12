import CreateListingProvider from "@components/listing/create/CreateProvider";
import { Stack } from "expo-router";

export default function () {
  return (
    <CreateListingProvider>
      <Stack>
        <Stack.Screen name="step-1" />
        <Stack.Screen name="type-of-place" />
        <Stack.Screen name="type-of-rent" />
        <Stack.Screen name="type-of-service" />
        <Stack.Screen name="location" />
        <Stack.Screen name="search-location" />
        <Stack.Screen name="room-detail" />
        <Stack.Screen name="basic-of-place" />
        <Stack.Screen name="amenity" />
        <Stack.Screen name="type-of-guest" />
        <Stack.Screen name="upload-images" />
        <Stack.Screen name="upload-title" />
        <Stack.Screen name="upload-description" />
        <Stack.Screen name="choose-date" />
        <Stack.Screen name="confirm-order" />
        <Stack.Screen name="price" />
        <Stack.Screen name="discount" />
        <Stack.Screen name="save-success" />
      </Stack>
    </CreateListingProvider>
  );
}
