import MasonryList from "@react-native-seoul/masonry-list";
import { usePathname } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";

import ListingCard from "./ListingCard";
import { allListPubRequest } from "../config/requests";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function ListingCardsContainer() {
  const pathname = usePathname();
  console.log(pathname);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentPageRef = useRef(currentPage);
  const allDataRef = useRef(allData);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await allListPubRequest(1);
      if (response.ok) {
        const newData = response.data.listings;
        if (newData.length === 0) {
          setHasMoreData(false);
        } else {
          setCurrentPage(1);
          setAllData(newData);
        }
      } else {
        console.log("Error loading data");
      }
    } catch {
      console.log("Error loading data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMoreData = async () => {
    if (loadingMore || !hasMoreData) {
      return;
    }
    setLoadingMore(true);
    try {
      const response = await allListPubRequest(currentPageRef.current + 1);
      if (response.ok) {
        const newData = response.data.listings;
        if (newData.length === 0) {
          setHasMoreData(false);
        } else {
          setCurrentPage(currentPageRef.current + 1);
          const currentData = allDataRef.current;
          setAllData([...currentData, ...newData]);
        }
      } else {
        console.log("Error loading data");
      }
    } catch {
      console.log("Error loading data");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    allDataRef.current = allData;
  }, [allData]);

  const endReachedHandler = () => {
    loadMoreData();
  };

  return (
    <MasonryList
      style={styles.container}
      data={allData}
      numColumns={2}
      renderItem={({ item }) => <ListingCard data={item} />}
      onEndReached={endReachedHandler}
      onEndReachedThreshold={0.1}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  );
}

export default ListingCardsContainer;
