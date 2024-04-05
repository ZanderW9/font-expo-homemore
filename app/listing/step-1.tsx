import { gql, useMutation, useQuery } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Button } from "@rneui/themed";
import {
  router,
  Stack,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";
import React, { useEffect, useCallback } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";

import i18n from "@/config/localizations/i18n";
import { RootState, useSelector } from "@/config/state/store";

const createListingMutation = gql`
  mutation Mutation {
    createListing {
      id
    }
  }
`;

const listingByIdQuery = gql`
  query Query($listingId: String!) {
    listingById(listingId: $listingId) {
      serviceType
      placeType
      rentType
      address
      placeDetails
      bedRoomDetails
      device
      safetyDevice
      guestType
      images {
        url
      }
      title
      description
      orderType
      price
      discount
    }
  }
`;

function Step1() {
  const { token } = useSelector((state: RootState) => state.appMeta);

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        router.replace("/user/sign-in");
      }
    }, [token]),
  );

  const colors = useThemedColors();
  const { listingId } = useLocalSearchParams();
  const { listingData, dispatchListingData } = useCreateListingContext();
  const { data: queriedListingData } = useQuery(listingByIdQuery, {
    variables: { listingId },
  });

  const [createListingFunction, { data, loading }] = useMutation(
    createListingMutation,
  );

  const nextHandler = async () => {
    if (listingData.listingId) {
      router.navigate({
        pathname: "/listing/type-of-service",
      });
    } else if (listingId) {
      const imageList = queriedListingData?.listingById?.images.map(
        (image: any) => image.url,
      );

      dispatchListingData({
        listingId,
        serviceType: queriedListingData?.listingById?.serviceType,
        placeType: queriedListingData?.listingById?.placeType,
        rentType: queriedListingData?.listingById?.rentType,
        address: queriedListingData?.listingById?.address,
        placeDetails: queriedListingData?.listingById?.placeDetails,
        bedRoomDetails: queriedListingData?.listingById?.bedRoomDetails,
        device: queriedListingData?.listingById?.device,
        safetyDevice: queriedListingData?.listingById?.safetyDevice,
        guestType: queriedListingData?.listingById?.guestType,
        images: imageList,
        title: queriedListingData?.listingById?.title,
        description: queriedListingData?.listingById?.description,
        orderType: queriedListingData?.listingById?.orderType,
        price: queriedListingData?.listingById?.price.toString(),
        discount: queriedListingData?.listingById?.discount,
      });
    } else {
      await createListingFunction();
    }
  };

  const backHandler = async () => {
    router.back();
  };

  useEffect(() => {
    if (listingData.listingId) {
      router.navigate({
        pathname: "/listing/type-of-service",
      });
    }
  }, [listingData.listingId]);

  useEffect(() => {
    if (data?.createListing.id) {
      dispatchListingData({
        ...listingData,
        listingId: data?.createListing.id,
      });
      router.navigate({
        pathname: "/listing/type-of-service",
      });
    }
  }, [data]);

  const labels = [
    i18n.t("create_listing.step_1_button"),
    i18n.t("create_listing.step_2_button"),
    i18n.t("create_listing.step_3_button"),
  ];

  return (
    <View style={styles.container}>
      <Button
        title={i18n.t("create_listing.save_and_exit")}
        type="clear"
        onPress={backHandler}
        buttonStyle={{
          justifyContent: "flex-start",
          marginVertical: 40,
          marginHorizontal: 10,
        }}
        titleStyle={{
          color: colors.mainColor,
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
          justifyContent: "center",
          padding: 20,
          flex: 0.8,
        }}
      >
        <Text style={styles.subtitle}>
          {i18n.t("create_listing.step_1_button")}
        </Text>
        <Text style={styles.title}>
          {i18n.t("create_listing.step_1.title")}
        </Text>
        <Text style={styles.subtitle}>
          {i18n.t("create_listing.step_1.subtitle")}
        </Text>
      </View>

      {/* 进度条 */}
      <MyStepIndicator currentPosition={0} stepCount={3} labels={labels} />

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
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
            title={i18n.t("back")}
            type="outline"
            onPress={backHandler}
            buttonStyle={{
              borderColor: colors.mainColor,
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
            titleStyle={{
              color: colors.mainColor,
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
          <Button
            title={
              loading ? (
                <ActivityIndicator color={colors.textReverse} size="small" />
              ) : (
                i18n.t("next")
              )
            }
            onPress={nextHandler}
            buttonStyle={{
              backgroundColor: colors.mainColor,
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
    paddingBottom: 10,
  },
});

export default Step1;
