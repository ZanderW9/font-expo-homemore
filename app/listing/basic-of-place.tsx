import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { router, Stack, useNavigation } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation UpdateListing(
    $updateListingId: String!
    $placeDetails: Json
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      placeDetails: $placeDetails
      published: $published
    ) {
      id
    }
  }
`;

function LocationScreen() {
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);

  const nextHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        placeDetails: listingData.placeDetails,
      },
    });
    router.navigate("/listing/room-detail");
  };

  const backHandler = async () => {
    router.back();
  };

  const navigation = useNavigation();
  const handleResetAction = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: "save-success" }],
      }),
    );
  };

  const saveAndExitHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        serviceType: listingData.serviceType,
        published: false,
      },
    });
    handleResetAction();
  };

  return (
    <View style={styles.container}>
      <Button
        title=" Save & Exit"
        type="clear"
        onPress={saveAndExitHandler}
        buttonStyle={{
          justifyContent: "flex-start",
          marginTop: 40,
          marginHorizontal: 10,
        }}
        titleStyle={{
          color: "rgb(236, 76, 96)",
          alignSelf: "center",
          justifyContent: "center",
        }}
      />
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerShown: false,
        }}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "flex-start",
          padding: 20,
          flex: 0.8,
        }}
      >
        <Text style={styles.title}>Share some details about your place</Text>
        <Text style={styles.subtitle}>
          Add the overall information of the place, and add the specific
          information of the house for rent later
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={styles.text}>Guests</Text>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="remove-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.guestCount > 1)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      guestCount: listingData.placeDetails.guestCount - 1,
                    },
                  });
              }}
            />
            <Text
              style={{
                fontSize: 22,
                marginTop: 0,
                width: 35,
                textAlign: "center",
              }}
            >
              {listingData.placeDetails.guestCount}
            </Text>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="add-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.guestCount < 16)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      guestCount: listingData.placeDetails.guestCount + 1,
                    },
                  });
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={styles.text}>Bedrooms</Text>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="remove-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.bedroomCount > 0)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      bedroomCount: listingData.placeDetails.bedroomCount - 1,
                    },
                  });
              }}
            />
            <Text
              style={{
                fontSize: 22,
                marginTop: 0,
                width: 35,
                textAlign: "center",
              }}
            >
              {listingData.placeDetails.bedroomCount}
            </Text>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="add-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.bedroomCount < 50)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      bedroomCount: listingData.placeDetails.bedroomCount + 1,
                    },
                  });
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={styles.text}>Beds</Text>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="remove-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.bedCount > 1)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      bedCount: listingData.placeDetails.bedCount - 1,
                    },
                  });
              }}
            />
            <Text
              style={{
                fontSize: 22,
                marginTop: 0,
                width: 35,
                textAlign: "center",
              }}
            >
              {listingData.placeDetails.bedCount}
            </Text>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="add-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.bedCount < 50)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      bedCount: listingData.placeDetails.bedCount + 1,
                    },
                  });
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={styles.text}>Bathrooms</Text>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="remove-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.bathCount > 0.5)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      bathCount: listingData.placeDetails.bathCount - 0.5,
                    },
                  });
              }}
            />
            <Text
              style={{
                fontSize: 22,
                marginTop: 0,
                width: 35,
                textAlign: "center",
              }}
            >
              {listingData.placeDetails.bathCount}
            </Text>
            <Ionicons
              style={{ marginRight: 10, marginLeft: 10 }}
              name="add-circle-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (listingData.placeDetails.bathCount < 50)
                  dispatchListingData({
                    placeDetails: {
                      ...listingData.placeDetails,
                      bathCount: listingData.placeDetails.bathCount + 0.5,
                    },
                  });
              }}
            />
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={4} stepCount={6} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginHorizontal: 20,
            justifyContent: "space-between",
          }}
          theme={{ background: "back1" }}
        >
          <Button
            title="Back"
            type="outline"
            onPress={backHandler}
            buttonStyle={{
              borderColor: "rgb(236, 76, 96)",
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
            titleStyle={{
              color: "rgb(236, 76, 96)",
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
          <Button
            title="Next"
            onPress={nextHandler}
            disabled={!listingData.rentType}
            buttonStyle={{
              backgroundColor: "rgb(236, 76, 96)",
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
          />
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
    paddingBottom: 0,
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  text: {
    fontSize: 22,
  },
});

export default LocationScreen;
