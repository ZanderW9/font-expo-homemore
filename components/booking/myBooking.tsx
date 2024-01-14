import { gql, useQuery, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import BaseInfo from "@components/booking/baseInformation";
import { useBookingContext } from "@components/booking/bookingProvider";
import CheckIn from "@components/booking/checkIn";
import PriceInfo from "@components/booking/priceInfo";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { showMessage } from "react-native-flash-message";

const listingDetailQuery = gql`
  query Query($ids: [String]) {
    allListings(ids: $ids) {
      id
      title
      images {
        smallUrl
        thumbhash
      }
      price
      address
      coordinate
      availability
      unavailability
      placeType
      rentType
      roomDetails
      roomDetails
      deviceType
      standoutType
      owner {
        userName
      }
    }
  }
`;

const createBookingMutation = gql`
  mutation Mutation(
    $listingId: Int!
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
  const { adultNum, childNum, infantNum, selectedDates } = useBookingContext();

  const { listingId } = useLocalSearchParams();
  const { data, refetch } = useQuery(listingDetailQuery, {
    variables: { ids: [listingId] },
    errorPolicy: "all",
  });
  console.log(data?.allListings[0].images[0].smallUrl);
  refetch();
  const [createBookingFunction] = useMutation(createBookingMutation, {
    errorPolicy: "all",
  });

  const confirmHandler = () => {
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
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Confirm your order",
          animation: "simple_push",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BaseInfo
          title={data?.allListings[0].title}
          price={data?.allListings[0].price}
          placeType={data?.allListings[0].placeType}
          rentType={data?.allListings[0].rentType}
          image={data?.allListings[0].images[0]}
        />
        <CheckIn
          availability={data?.allListings[0].availability}
          unavailability={data?.allListings[0].unavailability}
          guestCount={data?.allListings[0].roomDetails.Guests}
        />
        <PriceInfo price={data?.allListings[0].price} />
      </ScrollView>

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
    backgroundColor: "#fff",
  },
  safeArea: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
  },
  separator: {
    marginBottom: 3,
    height: 1,
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
