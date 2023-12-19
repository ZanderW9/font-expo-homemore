import * as ImageManipulator from "expo-image-manipulator";

export const compressImage = async (uri: string) => {
  // Adjust the compress value as needed to reduce the file size
  const compress = 0.5; // example compression value
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }], // You might need to adjust the size
    { compress, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result;
};
