import { DocumentNode, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const useCachedQuery = (
  query: DocumentNode,
  path: string,
  variables: object = {},
) => {
  const [data, setData] = useState(null);
  const { data: networkData, error, loading } = useQuery(query, { variables });

  useEffect(() => {
    // Get data from AsyncStorage using the path parameter
    AsyncStorage.getItem(path).then((cachedData) => {
      try {
        if (cachedData) {
          setData(JSON.parse(cachedData));
        }
      } catch (parseError) {
        console.error("Failed to parse cached data:", parseError);
        // Delete the problematic data from AsyncStorage
        AsyncStorage.removeItem(path);
      }
    });
  }, [path]);

  useEffect(() => {
    if (networkData && !error) {
      // Update state and AsyncStorage with new data using the path parameter
      setData(networkData);
      AsyncStorage.setItem(path, JSON.stringify(networkData));
    }
  }, [networkData, error, path]);

  return { data, error, loading };
};

export default useCachedQuery;
