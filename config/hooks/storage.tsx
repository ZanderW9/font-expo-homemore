import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

export const useGetLocalItem = <T,>(
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

export const useSetLocalItem = <T,>(
  key: string,
  value: T,
): {
  storedValue: T | null;
  loading: boolean;
  error: Error | null;
} => {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setStorageValue = async () => {
      try {
        const jsonValue = JSON.stringify(value);
        if (jsonValue) {
          await AsyncStorage.setItem(key, jsonValue);
          setStoredValue(value);
        } else {
          setStoredValue(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    setStorageValue();
  }, [key, value]);

  return { storedValue, loading, error };
};

export const useRemoveLocalItem = (
  key: string,
): {
  storedValue: null;
  loading: boolean;
  error: Error | null;
} => {
  const [storedValue, setStoredValue] = useState<null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const removeStorageValue = async () => {
      try {
        await AsyncStorage.removeItem(key);
        setStoredValue(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    removeStorageValue();
  }, [key]);

  return { storedValue, loading, error };
};
