import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Button } from "@rneui/themed";
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

const createListingMutation = gql`
  mutation Mutation {
    createListing {
      id
    }
  }
`;

function Step1() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [createListingFunction, { data }] = useMutation(createListingMutation);

  const nextHandler = async () => {
    createListingFunction();
  };

  const backHandler = async () => {
    router.back();
  };

  useEffect(() => {
    if (data?.createListing.id) {
      dispatchListingData({
        ...listingData,
        listingId: data?.createListing.id,
      });
      router.navigate({
        pathname: "/listing/type-of-service",
        params: { listingId: data?.createListing.id },
      });
    }
  }, [data]);

  const labels = ["Step 1", "Step 2", "Step 3"];

  return (
    <View style={styles.container}>
      <Button
        title=" Save & Exit"
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
        <Text style={styles.subtitle}>Step 1</Text>
        <Text style={styles.title}>Tell us about your place</Text>
        <Text style={styles.subtitle}>
          In this step, we will ask you which type of property you have and if
          guests will book the entire place or just a room. The let us know the
          location and how many guests can stay.
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
            title="Back"
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
            title="Next"
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
