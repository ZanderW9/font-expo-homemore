export const uploadImage = async (signedUrl, fileType, asset) => {
  try {
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: {
        uri: asset.uri,
      },
    });

    if (response.ok) {
      console.log("Image upload success");
    } else {
      console.log("Image upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const fetchDynamicUrl = async () => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_S3_URL}/${process.env.EXPO_PUBLIC_DEVELOPER}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
