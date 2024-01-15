import { gql, useQuery } from "@apollo/client";
import { Text, View } from "@components/Themed";
import Published from "@components/post/Published";
import Unpublished from "@components/post/Unpublished";
import { Stack } from "expo-router";
import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import PagerView from "react-native-pager-view";

const meQuery = gql`
  query Query {
    me {
      id
      myPublishedListings {
        id
        title
        description
        images {
          smallUrl
          thumbhash
          ratio
        }
        price
        favorited
        address
      }
      myUnPublishedListings {
        id
        title
        description
        images {
          smallUrl
          thumbhash
          ratio
        }
        price
        address
      }
    }
  }
`;

function MyPost() {
  const { data, refetch } = useQuery(meQuery);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  refetch();

  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const handleTabPress = (pageNumber: number) => {
    pagerRef.current?.setPage(pageNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "My Post",
          animation: "slide_from_right",
          headerTitleAlign: "center",
        }}
      />
      <View style={styles.content}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => handleTabPress(0)}
            style={styles.tabItem}
          >
            <Text
              style={currentPage === 0 ? styles.activeTabText : styles.tabText}
            >
              Published
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabPress(1)}
            style={styles.tabItem}
          >
            <Text
              style={currentPage === 1 ? styles.activeTabText : styles.tabText}
            >
              Draft
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
              <Published published={data?.me.myPublishedListings} />
            </ScrollView>
          </View>
          <View key="2">
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <Unpublished unpublished={data?.me.myUnPublishedListings} />
            </ScrollView>
          </View>
        </PagerView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 5,
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  separator: {
    marginBottom: 3,
    height: 1,
  },
  pagerView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default MyPost;
