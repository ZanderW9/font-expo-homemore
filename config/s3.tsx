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
