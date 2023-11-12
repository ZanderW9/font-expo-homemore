import AsyncStorage from "@react-native-async-storage/async-storage";

// 存储 value 到 local item
export const storeLocalItem = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    if (jsonValue) {
      await AsyncStorage.setItem(key, jsonValue);
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    await AsyncStorage.removeItem(key);
    console.error("Error storing token: ", error);
  }
};

// 获取 local item
export const getLocalItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      await AsyncStorage.removeItem(key);
      return null;
    }
  } catch (error) {
    await AsyncStorage.removeItem(key);
    console.error("Error getting token: ", error);
  }
};

// 清除 all local items
export const clearLocalItems = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing local items: ", error);
  }
};
