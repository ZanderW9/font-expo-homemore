import AsyncStorage from "@react-native-async-storage/async-storage";

// 存储 token
export const storeUserToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("userToken", token);
  } catch (error) {
    console.error("Error storing token: ", error);
  }
};

// 获取 token
export const getUserToken = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    return token;
  } catch (error) {
    console.error("Error getting token: ", error);
  }
};

// 清除 token
export const clearUserToken = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing token: ", error);
  }
};
