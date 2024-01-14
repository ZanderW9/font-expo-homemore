import { gql, useQuery } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import DetailEnd from "@components/detail/DetailEnd";
import DetailPart1 from "@components/detail/DetailPart1";
import DetailPart2 from "@components/detail/DetailPart2";
import DetailPart3 from "@components/detail/DetailPart3";
import DetailPart4 from "@components/detail/DetailPart4";
import DetailPart5 from "@components/detail/DetailPart5";
import DetailProvider from "@components/detail/DetailProvider";
import ReviewInputModal from "@components/detail/InputModal";
import MyCarousel from "@components/detail/MyCarousel";
import ShareModal from "@components/detail/ShareModal";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Avatar } from "@rneui/themed";
import { useLocalSearchParams, Stack, router } from "expo-router";
import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

const listingDetailQuery = gql`
  query Query($ids: [String]) {
    allListings(ids: $ids) {
      id
      title
      description
      images {
        url
        smallUrl
        thumbhash
        width
        height
      }
      price
      address
      coordinate
      favorited
      availability
      unavailability
      createdAt
      publishAt
      placeType
      rentType
      roomDetails
      deviceType
      standoutType
      safetyDeviceType
      guestType
      owner {
        userName
        avatar
        id
      }
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
          avatar
        }
        subReviews {
          text
          id
          createdAt
          sender {
            id
            userName
            avatar
          }
          receiver {
            id
            userName
            avatar
          }
        }
      }
    }
  }
`;

const CustomHeaderTitle = (data: any) => {
  const owner = data ? data?.allListings[0]?.owner : null;

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={() => console.log("pressed")}
    >
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
    </Pressable>
  );
};

function ListingDetailScreen() {
  const { listing } = useLocalSearchParams();
  const { data } = useQuery(listingDetailQuery, {
    variables: { ids: [listing] },
    errorPolicy: "all",
  });

  const inputRef = useRef(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const openBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const shareBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const openShareBottomSheet = useCallback(() => {
    shareBottomSheetModalRef.current?.present();
  }, []);

  const toggleCheckboxHandler = () => {
    router.push({
      pathname: "/addwishlist",
      params: { listingId: data.allListings[0].id },
    });
  };

  return (
    <DetailProvider>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: () => CustomHeaderTitle(data),
            animation: "slide_from_right",
            headerRight: () => (
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginRight: 10,
                }}
                onPress={() => {
                  openShareBottomSheet();
                }}
              >
                <Ionicons name="ellipsis-vertical" size={28} color="gray" />
              </TouchableOpacity>
            ),
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Carousel */}
          <MyCarousel images={data ? data.allListings[0]?.images : []} />
          {/* Part1 */}
          <DetailPart1 data={data ? data.allListings[0] : {}} />
          {/* Part2 */}
          <DetailPart2
            bathRooms={data ? data.allListings[0]?.roomDetails.Bathrooms : 0}
            bedRooms={data ? data.allListings[0]?.roomDetails.Bedrooms : 0}
            bed={data ? data.allListings[0]?.roomDetails.Bed : 0}
            guests={data ? data.allListings[0]?.roomDetails.Guests : 0}
            placeType={data ? data.allListings[0]?.placeType : ""}
            rentType={data ? data.allListings[0]?.rentType : ""}
            price={data ? data.allListings[0]?.price : 0}
            guestType={data ? data.allListings[0]?.guestType : []}
          />
          {/* Part3 */}
          <DetailPart3
            lat={data ? data.allListings[0]?.coordinate.lat : 0}
            lng={data ? data.allListings[0]?.coordinate.lng : 0}
          />
          {/* Part4 */}
          <DetailPart4
            deviceType={data ? data.allListings[0]?.deviceType : []}
            standoutType={data ? data.allListings[0]?.standoutType : []}
            safetyDeviceType={data ? data.allListings[0]?.safetyDeviceType : []}
          />

          {/* Part5 */}
          <DetailPart5
            reviews={data ? data.allListings[0]?.reviews : []}
            openBottomSheet={openBottomSheet}
          />
          {/* End */}
          <DetailEnd />
        </ScrollView>
        {/* BottomSheet */}
        <ReviewInputModal
          listingId={data ? data.allListings[0]?.id : null}
          // receiverId={data ?
          bottomSheetModalRef={bottomSheetModalRef}
          inputRef={inputRef}
        />
        {/* ShareBottomSheet */}
        <ShareModal
          bottomSheetModalRef={shareBottomSheetModalRef}
          listingId={data ? data.allListings[0]?.id : 0}
          userId={data ? data.allListings[0]?.owner.id : 0}
        />
        {/* Bottom */}
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingVertical: 5,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginStart: 10,
                marginVertical: 5,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: 20,
                flex: 1,
              }}
              onPress={openBottomSheet}
            >
              <SimpleLineIcons
                name="pencil"
                size={13}
                color="rgba(0, 0, 0, 0.5)"
              />
              <Text
                style={{
                  fontSize: 15,
                  color: "gray",
                  marginLeft: 5,
                }}
              >
                Leave a review ···
              </Text>
            </Pressable>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="md-chatbubble-ellipses-outline"
                size={32}
                color="black"
              />
              <Text
                style={{
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {data ? data.allListings[0]?.reviews.length : 0}
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {data && data?.allListings[0]?.favorited ? (
                <Ionicons
                  name="md-heart"
                  size={32}
                  color="rgb(236, 76, 96)"
                  onPress={() => {
                    toggleCheckboxHandler();
                  }}
                />
              ) : (
                <Ionicons
                  name="md-heart-outline"
                  size={32}
                  color="black"
                  onPress={() => {
                    toggleCheckboxHandler();
                  }}
                />
              )}
              {/* <Text
              style={{
                fontSize: 13,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              Save
            </Text> */}
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => {
                  router.push({
                    pathname: "/booking",
                    params: { listingId: data.allListings[0].id },
                  });
                }}
              >
                <Text style={styles.reserveButtonText}>Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </DetailProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  separator: {
    marginBottom: 3,
    height: 1,
  },
  reserveButton: {
    backgroundColor: "rgb(236, 76, 96)",
    padding: 10,
    borderRadius: 5,
  },
  reserveButtonText: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
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

export default ListingDetailScreen;
