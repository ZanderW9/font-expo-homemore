import { gql, useQuery } from "@apollo/client";
import { View, Text } from "@components/Themed";
import Published from "@components/post/Published";
import FavoriteCardsContainer from "@components/wishlist/FavoriteCardsContainer";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";
import { useLocalSearchParams, Stack, router } from "expo-router";
import React, { useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PagerView from "react-native-pager-view";

const meQuery = gql`
  query Query($userId: String) {
    myself: me {
      id
    }

    me(userId: $userId) {
      id
      userName
      gender
      avatar
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
      favorites(userId: $userId) {
        private
        id
        name
        description
        owner {
          id
        }
        listings {
          listing {
            id
            images {
              smallUrl
              thumbhash
            }
          }
        }
      }
    }
  }
`;

const CustomHeaderTitle = (data: any) => {
  const owner = data ? data?.me : null;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {owner?.avatar ? (
        <Avatar
          size={35}
          rounded
          containerStyle={styles.Avatar}
          source={{
            uri: owner?.avatar,
          }}
        />
      ) : (
        <Avatar
          size={35}
          rounded
          containerStyle={styles.Avatar}
          title={owner?.userName?.slice(0, 2) ?? ""}
          titleStyle={{
            justifyContent: "center",
            alignSelf: "center",
            fontSize: 20,
          }}
        />
      )}
      <Text style={styles.headerTitle}>{owner ? owner?.userName : ""}</Text>
    </View>
  );
};

function UserScreen() {
  const { userId } = useLocalSearchParams();
  const { data } = useQuery(meQuery, {
    variables: { userId },
  });

  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const handleTabPress = (pageNumber: number) => {
    pagerRef.current?.setPage(pageNumber);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => CustomHeaderTitle(data),
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerBackTitle: "Details",
          headerRight: () => (
            <Ionicons
              name="md-chatbubble-ellipses-outline"
              size={26}
              color="black"
              onPress={() => {
                const chatId = [data?.myself?.id, data?.me?.id]
                  .sort()
                  .join("__");
                router.push({
                  pathname: "/inbox/[chatId]",
                  params: {
                    chatId,
                    userId: data?.me?.id,
                    userName: data?.me?.userName,
                  },
                });
              }}
            />
          ),
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
              Wishlist
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <Published published={data?.me.myPublishedListings} />
            </ScrollView>
          </View>
          <View key="2">
            <ScrollView showsVerticalScrollIndicator={false}>
              <FavoriteCardsContainer data={data?.me?.favorites} />
            </ScrollView>
          </View>
        </PagerView>
      </View>
    </View>
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
  Avatar: {
    marginRight: 10,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor: "#F3EED9",
  },
  headerTitle: {
    fontSize: 18,
    justifyContent: "flex-start",
    alignContent: "center",
  },
});

export default UserScreen;
