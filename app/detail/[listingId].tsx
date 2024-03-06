import { useQuery } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "@components/Themed";
import BasicInfo from "@components/detail/BasicInfo";
import DetailEnd from "@components/detail/DetailEnd";
import DetailProvider from "@components/detail/DetailProvider";
import EditReviewModal from "@components/detail/EditReviewModal";
import Facility from "@components/detail/Facility";
import ReviewInputModal from "@components/detail/InputModal";
import Location from "@components/detail/Location";
import MyCarousel from "@components/detail/MyCarousel";
import OverView from "@components/detail/OverView";
import Review from "@components/detail/Review";
import ShareModal from "@components/detail/ShareModal";
import AddModal from "@components/wishlist/AddModal";
import { DETAIL_PAGE_LISTING_QUERY } from "@config/gql/listing";
import { useThemedColors } from "@constants/theme";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Avatar } from "@rneui/themed";
import { useLocalSearchParams, Stack, router } from "expo-router";
import React, { useRef, useCallback, useContext } from "react";
import { StyleSheet } from "react-native";

const CustomHeaderTitle = (data: any) => {
  const owner = data ? data?.listingById?.owner : null;

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center" }}
      onPress={() => router.navigate(`/user/${owner?.id}`)}
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
  const colors = useThemedColors();
  const { isLoggedIn, me } = useContext(GlobalContext);
  const { listingId } = useLocalSearchParams();
  const { data } = useQuery(DETAIL_PAGE_LISTING_QUERY, {
    variables: { listingId },
    errorPolicy: "all",
  });
  const inputRef = useRef(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetAddModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetEditModalRef = useRef<BottomSheetModal>(null);
  const openBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const openEditBottomSheet = useCallback(() => {
    bottomSheetEditModalRef.current?.present();
  }, []);

  const shareBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const openShareBottomSheet = useCallback(() => {
    shareBottomSheetModalRef.current?.present();
  }, []);

  const toggleCheckboxHandler = () => {
    if (!isLoggedIn) {
      router.navigate("/signin");
    } else {
      bottomSheetAddModalRef.current?.present();
    }
  };

  return (
    <DetailProvider>
      <View style={styles.container} theme={{ background: "back2" }}>
        <Stack.Screen
          options={{
            headerTitle: () => CustomHeaderTitle(data),
            animation: "slide_from_right",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            headerBackButtonMenuEnabled: false,
            headerStyle: {
              backgroundColor: colors.back1,
            },
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
          <MyCarousel images={data ? data.listingById?.images : []} />
          {/* Part1 */}
          <BasicInfo data={data ? data.listingById : {}} />
          {/* Part2 */}
          <OverView
            bathRooms={data ? data.listingById?.placeDetails.bathCount : 0}
            bedRooms={data ? data.listingById?.placeDetails.bedroomCount : 0}
            bed={data ? data.listingById?.placeDetails.bedCount : 0}
            guests={data ? data.listingById?.placeDetails.guestCount : 0}
            placeType={data ? data.listingById?.placeType : ""}
            rentType={data ? data.listingById?.rentType : ""}
            price={data ? data.listingById?.price : 0}
            guestType={data ? data.listingById?.guestType : []}
          />
          {/* Part3 */}
          <Location
            lat={data ? data.listingById?.coordinate.lat : 0}
            lng={data ? data.listingById?.coordinate.lng : 0}
            address={data ? data.listingById?.address : ""}
            listing={data ? data.listingById : {}}
          />
          {/* Part4 */}
          <Facility
            device={data ? data.listingById?.device : []}
            safetyDevice={data ? data.listingById?.safetyDevice : []}
          />

          {/* Part5 */}
          <Review
            reviews={data ? data.listingById?.reviews : []}
            openBottomSheet={openBottomSheet}
            openEditBottomSheet={openEditBottomSheet}
          />
          {/* End */}
          <DetailEnd />
        </ScrollView>
        {/* BottomSheet */}
        <ReviewInputModal
          listingId={data ? data.listingById?.id : null}
          // receiverId={data ?
          bottomSheetModalRef={bottomSheetModalRef}
          inputRef={inputRef}
        />
        {/* EditBottomSheet */}
        <EditReviewModal
          bottomSheetModalRef={bottomSheetEditModalRef}
          listingId={data ? data.listingById?.id : null}
        />
        {/* ShareBottomSheet */}
        <ShareModal
          bottomSheetModalRef={shareBottomSheetModalRef}
          listingId={data ? data.listingById?.id : 0}
          userId={data ? data.listingById?.owner.id : 0}
        />
        {/* AddBottomSheet */}
        <AddModal
          bottomSheetModalRef={bottomSheetAddModalRef}
          listingId={data ? data.listingById?.id : 0}
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
                paddingHorizontal: 5,
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
                paddingHorizontal: 5,
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={32}
                color={colors.text}
                onPress={() => {
                  const chatId = [data?.listingById?.owner.id, me?.id]
                    .sort()
                    .join("__");
                  router.navigate({
                    pathname: "/inbox/[chatId]",
                    params: {
                      chatId,
                      userId: data?.listingById?.owner.id,
                      userName: data?.listingById?.owner.userName,
                    },
                  });
                }}
              />
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingHorizontal: 5,
              }}
            >
              {data && data?.listingById?.favorited ? (
                <Ionicons
                  name="heart"
                  size={32}
                  color="rgb(236, 76, 96)"
                  onPress={() => {
                    toggleCheckboxHandler();
                  }}
                />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={32}
                  color={colors.text}
                  onPress={() => {
                    toggleCheckboxHandler();
                  }}
                />
              )}
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
                  router.navigate({
                    pathname: "/booking",
                    params: { listingId: data.listingById.id },
                  });
                }}
              >
                <Text style={styles.reserveButtonText}>Request</Text>
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
