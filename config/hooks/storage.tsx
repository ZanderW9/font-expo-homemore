import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export const useASGet = <T,>(
  key: string,
): {
  storedValue: T | null;
  loading: boolean;
  error: Error | null;
} => {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStorageValue = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          setStoredValue(JSON.parse(value) as T);
        } else {
          setStoredValue(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStorageValue();
  }, [key]);

  return { storedValue, loading, error };
};
