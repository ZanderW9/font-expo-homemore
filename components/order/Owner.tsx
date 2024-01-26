import { Text, View } from "@components/Themed";
import PendingCard from "@components/order/PendingCard";
import ProcessedCard from "@components/order/ProcessedCard";
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
            Pending Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress(1)}
          style={styles.tabItem}
        >
          <Text
            style={currentPage === 1 ? styles.activeTabText : styles.tabText}
          >
            Processed Order
          </Text>
        </TouchableOpacity>
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(event) => setCurrentPage(event.nativeEvent.position)}
        ref={pagerRef}
      >
        <View key="1" style={{ backgroundColor: "#f5f5f5" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {data.receivedBookings
              .filter((item: any) => item.status === "pending")
              .map((item: any) => (
                <View key={item.id}>
                  <PendingCard
                    orderId={item.id}
                    image={item.listing.images[0]}
                    dataRange={item.dataRange}
                    createdAt={item.createdAt}
                    guestType={item.guestType}
                    userName={item.guests[0].user.userName}
                    userId={item.guests[0].user.id}
                  />
                </View>
              ))}
          </ScrollView>
        </View>
        <View key="2" style={{ backgroundColor: "#f5f5f5" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {data.receivedBookings
              .filter((item: any) => item.status !== "pending")
              .map((item: any) => (
                <View key={item.id}>
                  <ProcessedCard
                    orderId={item.id}
                    image={item.listing.images[0]}
                    dataRange={item.dataRange}
                    createdAt={item.createdAt}
                    guestType={item.guestType}
                    userName={item.guests[0].user.userName}
                    userId={item.guests[0].user.id}
                    status={item.status}
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
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  pagerView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
    fontSize: 18,
    fontWeight: "bold",
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
