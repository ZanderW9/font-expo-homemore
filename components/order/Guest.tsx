import { Text, View } from "@components/Themed";
import GuestCard from "@components/order/GuestCard";
import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import PagerView from "react-native-pager-view";

function OwnerContent(data: any) {
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleTabPress = (pageNumber: number) => {
    pagerRef.current?.setPage(pageNumber);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    data.refetch();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => handleTabPress(0)}
          style={styles.tabItem}
        >
          <Text
            style={currentPage === 0 ? styles.activeTabText : styles.tabText}
          >
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress(1)}
          style={styles.tabItem}
        >
          <Text
            style={currentPage === 1 ? styles.activeTabText : styles.tabText}
          >
            Completed Orders
          </Text>
        </TouchableOpacity>
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(event) => setCurrentPage(event.nativeEvent.position)}
        ref={pagerRef}
      >
        <View key="1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {data.myRequests?.map((item: any) => (
              <View key={item.booking.id}>
                <GuestCard
                  id={item.booking.id}
                  guestType={item.booking.guestType}
                  createdAt={item.booking.createdAt}
                  status={item.booking.status}
                  dataRange={item.booking.dataRange}
                  image={item.booking.listing.images[0]}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <View key="2">
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {data.myRequests
              ?.filter((item: any) => item.booking.status === "accepted")
              ?.map((item: any) => (
                <View key={item.booking.id}>
                  <GuestCard
                    id={item.booking.id}
                    guestType={item.booking.guestType}
                    createdAt={item.booking.createdAt}
                    status={item.booking.status}
                    dataRange={item.booking.dataRange}
                    image={item.booking.listing.images[0]}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  pagerView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
  },
  tabItem: {
    padding: 10,
  },
  tabText: {
    color: "rgba(0,0,0,0.5)",
    fontSize: 14,
  },
  activeTabText: {
    color: "rgba(0,0,0,1)",
    fontSize: 15,
  },
  separator: {
    marginBottom: 3,
    height: 1,
  },
  title: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 10,
    borderRadius: 5,
  },
});

export default OwnerContent;
