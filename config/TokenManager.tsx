import AsyncStorage from "@react-native-async-storage/async-storage";

// 存储 token
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("userToken", token);
  } catch (error) {
    console.error("Error storing token: ", error);
  }
};

// 获取 token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    return token;
  } catch (error) {
    console.error("Error getting token: ", error);
  }
};

// 清除 token
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error clearing token: ", error);
  }
};
