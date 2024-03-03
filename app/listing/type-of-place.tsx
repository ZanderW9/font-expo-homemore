import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView, TouchableOpacity } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router, Stack } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation UpdateListing($updateListingId: String!, $placeType: String) {
    updateListing(id: $updateListingId, placeType: $placeType) {
      id
    }
  }
`;

function TypeOfPalceScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);
  const nextHandler = async () => {
    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        placeType: listingData.placeType,
      },
    });
    router.navigate("/listing/type-of-rent");
  };

  const backHandler = async () => {
    router.back();
  };

  const typeOfPlace = [
    {
      name: "House",
      value: "house",
      icon: <MaterialIcons name="house-siding" size={30} color={colors.text} />,
    },

    {
      name: "Apartment",
      value: "apartment",
      icon: <MaterialIcons name="apartment" size={30} color={colors.text} />,
    },
    {
      name: "Unit",
      value: "unit",
      icon: <MaterialIcons name="domain" size={30} color={colors.text} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Button
        title=" Save & Exit"
        type="clear"
        onPress={backHandler}
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
          justifyContent: "center",
          padding: 20,
          flex: 0.8,
        }}
      >
        <Text style={styles.title}>
          Which of the following best describes your place?
        </Text>

        <FlashList
          estimatedItemSize={100}
          data={typeOfPlace}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const newPlaceType = item.value;
                dispatchListingData({
                  ...listingData,
                  placeType: newPlaceType,
                });
              }}
              style={{
                alignItems: "center",
                width: "100%",
                padding: 5,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  minWidth: 80,
                  width: "100%",
                  maxWidth: 200,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingBottom: 5,
                  paddingTop: 6,
                  borderColor:
                    listingData.placeType === item.value
                      ? "#888"
                      : colors.border1,
                  height: 85,
                  backgroundColor:
                    listingData.placeType === item.value
                      ? colors.back2
                      : colors.back1,
                }}
              >
                <View
                  style={{
                    margin: 5,
                    height: 30,
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  {item.icon}
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={1} stepCount={6} />
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
            disabled={!listingData.placeType}
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
    paddingBottom: 10,
  },
});

export default TypeOfPalceScreen;
