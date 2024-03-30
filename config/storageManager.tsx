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

// 获取多个 local items
export const getLocalItems = async (keys: string[]) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result = {};
    values.forEach(([key, value]) => {
      if (value) {
        result[key] = JSON.parse(value);
      } else {
        AsyncStorage.removeItem(key);
      }
    });
    return result;
  } catch (error) {
    await AsyncStorage.multiRemove(keys);
    console.error("Error getting tokens: ", error);
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

// 清除指定 local item
export const removeLocalItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing local item: ", error);
  }
};
