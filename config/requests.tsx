import { getLocalItem } from "@config/storageManager";

const fatchData = async (url: string, method: string, body = undefined) => {
  const token = await getLocalItem("userToken");

  const requestOption = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  };
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}${url}`,
      requestOption,
    );
    if (response.ok) {
      const data = await response.json();
      return { data, ok: true };
    } else {
      const data = await response.json();
      return { error: data.error, ok: false };
    }
  } catch {
    return { error: "Lost connection...", ok: false };
  }
};

export const signImageUrl = async (fileName: string, fileType: string) => {
  const body = { fileName, fileType };
  const response = await fatchData("/api/signS3Image", "POST", body);
  return response;
};

export const deleteImageFromS3 = async (fileName: string) => {
  const body = { fileName };
  const response = await fatchData("/api/deleteS3Image", "POST", body);
  return response;
};
