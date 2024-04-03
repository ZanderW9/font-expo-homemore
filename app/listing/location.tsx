import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { router, Stack, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Pressable, ActivityIndicator } from "react-native";

const updateListingMutation = gql`
  mutation UpdateListing(
    $updateListingId: String!
    $rentType: String
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      rentType: $rentType
      published: $published
    ) {
      id
    }
  }
`;

function LocationScreen() {
  const colors = useThemedColors();
  const { listingData } = useCreateListingContext();
  const [updateListingFunction, { loading }] = useMutation(
    updateListingMutation,
  );

  const nextHandler = async () => {
    router.navigate("/listing/basic-of-place");
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
        <Text style={styles.title}>Where's your place located?</Text>
        <Text style={styles.subtitle}>
          Guests will only get your exact address once they've booked a stay.
        </Text>

        <Pressable
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            borderWidth: 1,
            borderColor: colors.border1,
            borderRadius: 20,
            paddingLeft: 10,
            paddingRight: 30,
            paddingVertical: 10,
          }}
          onPress={() => router.navigate("/listing/search-location")}
        >
          <Ionicons name="search" size={24} color="black" />

          {listingData?.address?.street ? (
            <Text style={styles.search}>
              {listingData?.address?.street}, {listingData?.address?.city},{" "}
              {listingData?.address?.state}, {listingData?.address?.postCode},{" "}
              {listingData?.address?.country}
            </Text>
          ) : (
            <Text style={styles.search}>Enter your address</Text>
          )}
        </Pressable>
        {/* 
        {listingData.address.street && location.coords && (
          <MapView
            userLocation={{
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              accuracy: location.coords.accuracy,
            }}
            listings={[]}
            center={{
              lat: location.coords.latitude,
              lng: location.coords.longitude,
              latDelta: 0.0922,
              lngDelta: 0.0421,
            }}
            setCenter={() => {}}
            refetch={() => {}}
            scrollEnabled // 设置可拖动
          />
        )} */}
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={3} stepCount={6} />
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
            title={
              loading ? (
                <ActivityIndicator color={colors.textReverse} size="small" />
              ) : (
                "Next"
              )
            }
            onPress={nextHandler}
            disabled={listingData?.address?.street === ""}
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
  search: {
    color: "gray",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default LocationScreen;
