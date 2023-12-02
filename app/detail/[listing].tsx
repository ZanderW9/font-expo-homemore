import { gql, useQuery } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import DetailEnd from "@components/detail/DetailEnd";
import DetailPart1 from "@components/detail/DetailPart1";
import DetailPart2 from "@components/detail/DetailPart2";
import DetailPart3 from "@components/detail/DetailPart3";
import DetailPart4 from "@components/detail/DetailPart4";
import DetailPart5 from "@components/detail/DetailPart5";
import ReviewInputModal from "@components/detail/InputModal";
import MyCarousel from "@components/detail/MyCarousel";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, Stack, router } from "expo-router";
import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

const listingDetailQuery = gql`
  query Query($listingDetailId: Int) {
    listingDetail(id: $listingDetailId) {
      id
      title
      description
      images
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
      amenities
      guestType
      meta
      owner {
        userName
      }
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
        }
      }
    }
  }
`;

function ListingDetailScreen() {
  const { listing } = useLocalSearchParams();
  const { data } = useQuery(listingDetailQuery, {
    variables: { listingDetailId: parseInt(listing) },
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

  const toggleCheckboxHandler = () => {
    router.push({
      pathname: "/addwishlist",
      params: { listingId: data.listingDetail.id },
    });
  };

  return (
    // <SafeAreaView style={styles.container} edges={["bottom"]}>
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: data ? data.listingDetail.owner.userName : "",
          animation: "simple_push",
          headerRight: () => (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginRight: 10,
              }}
              onPress={() => {
                // 处理分享按钮点击事件
              }}
            >
              <Ionicons name="md-share-outline" size={28} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carousel */}
        <MyCarousel images={data ? data.listingDetail.images : []} />
        {/* Part1 */}
        <DetailPart1 data={data ? data.listingDetail : {}} />
        {/* Part2 */}
        <DetailPart2
          bathRooms={data ? data.listingDetail.roomDetails.Bathrooms : 0}
          bedRooms={data ? data.listingDetail.roomDetails.Bedrooms : 0}
          bed={data ? data.listingDetail.roomDetails.Bed : 0}
          guests={data ? data.listingDetail.roomDetails.Guests : 0}
          placeType={data ? data.listingDetail.placeType : ""}
          rentType={data ? data.listingDetail.rentType : ""}
          price={data ? data.listingDetail.price : 0}
          guestType={data ? data.listingDetail.guestType : []}
        />
        {/* Part3 */}
        <DetailPart3
          lat={data ? data.listingDetail.coordinate.lat : 0}
          lng={data ? data.listingDetail.coordinate.lng : 0}
        />
        {/* Part4 */}
        <DetailPart4 amenities={data ? data.listingDetail.amenities : []} />
        {/* Part5 */}
        <DetailPart5
          reviews={data ? data.listingDetail.reviews : []}
          openBottomSheet={openBottomSheet}
        />
        {/* End */}
        <DetailEnd />
      </ScrollView>
      {/* BottomSheet */}
      <ReviewInputModal
        listingId={data ? data.listingDetail.id : 0}
        bottomSheetModalRef={bottomSheetModalRef}
        inputRef={inputRef}
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
              {data ? data.listingDetail.reviews.length : 0}
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
            {data && data?.listingDetail?.favorited ? (
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
                  params: { listingId: data.listingDetail.id },
                });
              }}
            >
              <Text style={styles.reserveButtonText}>Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
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
});

export default ListingDetailScreen;
