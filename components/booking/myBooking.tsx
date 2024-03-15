import { gql, useQuery, useMutation } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import { View, Text, SafeAreaView } from "@components/Themed";
import BaseInfo from "@components/booking/baseInformation";
import { useBookingContext } from "@components/booking/bookingProvider";
import CheckIn from "@components/booking/checkIn";
import PriceInfo from "@components/booking/priceInfo";
import { BOOKING_PAGE_LISTING_QUERY } from "@config/gql/listing";
import { useThemedColors } from "@constants/theme";
import { Divider } from "@rneui/themed";
import { Stack, useLocalSearchParams, router } from "expo-router";
import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { showMessage } from "react-native-flash-message";

const createBookingMutation = gql`
  mutation Mutation(
    $listingId: String!
    $guestType: Json!
    $dataRange: [String!]!
    $status: String!
  ) {
    createBooking(
      listingId: $listingId
      guestType: $guestType
      dataRange: $dataRange
      status: $status
    ) {
      id
    }
  }
`;

function MyBooking() {
  const colors = useThemedColors();
  const { isLoggedIn } = useContext(GlobalContext);
  const { adultNum, childNum, infantNum, selectedDates } = useBookingContext();

  const { listingId } = useLocalSearchParams();
  const { data, refetch } = useQuery(BOOKING_PAGE_LISTING_QUERY, {
    variables: { listingId },
    errorPolicy: "all",
  });
  refetch();
  const [createBookingFunction] = useMutation(createBookingMutation, {
    errorPolicy: "all",
  });

  const confirmHandler = () => {
    if (!isLoggedIn) {
      router.navigate("/signin");
    } else {
      if (selectedDates.length === 0) {
        showMessage({
          type: "info",
          message: "Please select a date.",
        });
        return;
      }
      createBookingFunction({
        variables: {
          listingId,
          guestType: {
            Adults: adultNum,
            Children: childNum,
            Infants: infantNum,
          },
          dataRange: selectedDates,
          status: "pending",
        },
      });
      showMessage({
        type: "success",
        message: "Successfully sent booking request.",
      });
      router.navigate("/");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Confirm your order",
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BaseInfo
          title={data?.listingById.title}
          price={data?.listingById.price}
          placeType={data?.listingById.placeType}
          rentType={data?.listingById.rentType}
          image={data?.listingById.images[0]}
        />
        <CheckIn
          availability={data?.listingById.availability}
          unavailability={data?.listingById.unavailability}
          guestCount={data?.listingById.placeDetails.guestCount}
        />
        <PriceInfo price={data?.listingById.price} />
      </ScrollView>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <Divider width={1} color={colors.border1} />
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
            onPress={confirmHandler}
          >
            <Text style={styles.reserveButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  reserveButton: {
    backgroundColor: "rgb(236, 76, 96)",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  reserveButtonText: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default MyBooking;
