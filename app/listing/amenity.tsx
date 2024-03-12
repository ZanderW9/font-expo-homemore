import { gql, useMutation } from "@apollo/client";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import {
  MaterialIcons,
  FontAwesome6,
  MaterialCommunityIcons,
  Ionicons,
  Fontisto,
} from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router, Stack, useNavigation } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation UpdateListing(
    $updateListingId: String!
    $device: [String]
    $safetyDevice: [String]
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      device: $device
      safetyDevice: $safetyDevice
      published: $published
    ) {
      id
    }
  }
`;

function AmenityScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);
  const nextHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        device: listingData.device,
        safetyDevice: listingData.safetyDevice,
      },
    });
    router.navigate("/listing/type-of-guest");
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

  const device = [
    {
      name: "Wi-Fi",
      value: "Wi-Fi",
      icon: <FontAwesome6 name="wifi" size={26} color={colors.text} />,
    },

    {
      name: "TV",
      value: "TV",
      icon: <MaterialIcons name="tv" size={30} color={colors.text} />,
    },
    {
      name: "Kitchen",
      value: "kitchen",
      icon: <FontAwesome6 name="kitchen-set" size={26} color={colors.text} />,
    },
    {
      name: "Washing Machine",
      value: "washingMachine",
      icon: (
        <MaterialCommunityIcons
          name="washing-machine"
          size={30}
          color={colors.text}
        />
      ),
    },
    {
      name: "Air Conditioner",
      value: "airConditioner",
      icon: <Ionicons name="snow" size={30} color={colors.text} />,
    },
    {
      name: "parking",
      value: "parking",
      icon: (
        <FontAwesome6 name="square-parking" size={30} color={colors.text} />
      ),
    },
    {
      name: "Work Space",
      value: "workSpace",
      icon: (
        <MaterialCommunityIcons name="desk" size={30} color={colors.text} />
      ),
    },
    {
      name: "Exercise Equipment",
      value: "exerciseEquipment",
      icon: (
        <MaterialCommunityIcons
          name="weight-lifter"
          size={30}
          color={colors.text}
        />
      ),
    },
    {
      name: "Bath Tub",
      value: "bathTub",
      icon: (
        <MaterialCommunityIcons
          name="bathtub-outline"
          size={30}
          color={colors.text}
        />
      ),
    },
  ];

  const safetyDevice = [
    {
      name: "Smoke Alarm",
      value: "smokeAlarm",
      icon: (
        <MaterialCommunityIcons
          name="smoke-detector"
          size={30}
          color={colors.text}
        />
      ),
    },
    {
      name: "First Aid Kit",
      value: "firstAidKit",
      icon: <Fontisto name="first-aid-alt" size={26} color={colors.text} />,
    },
    {
      name: "Fire Extinguisher",
      value: "fireExtinguisher",
      icon: (
        <MaterialCommunityIcons
          name="fire-extinguisher"
          size={30}
          color={colors.text}
        />
      ),
    },
    {
      name: "Carbon Monoxide Alarm",
      value: "carbonMonoxideAlarm",
      icon: (
        <MaterialCommunityIcons
          name="smoke-detector-outline"
          size={30}
          color={colors.text}
        />
      ),
    },
  ];

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
      <ScrollView style={{ padding: 20, minHeight: 10, minWidth: 10 }}>
        <Text style={styles.title}>
          Tell guests what your place has to offer
        </Text>

        <View style={{ minHeight: 10, minWidth: 10 }}>
          <FlashList
            estimatedItemSize={100}
            data={device}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  const newDevice = listingData.device?.includes(item.value)
                    ? listingData.device?.filter(
                        (device) => device !== item.value,
                      )
                    : [...(listingData.device || []), item.value];
                  dispatchListingData({
                    ...listingData,
                    device: newDevice,
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
                    borderColor: listingData.device?.includes(item.value)
                      ? "#888"
                      : colors.border1,
                    height: 85,
                    backgroundColor: listingData.device?.includes(item.value)
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

        <Text
          style={{
            ...styles.subtitle,
            paddingHorizontal: 5,
            marginTop: 10,
          }}
        >
          Do you have any of these safety items?
        </Text>

        <View style={{ minHeight: 10, minWidth: 10 }}>
          <FlashList
            estimatedItemSize={100}
            data={safetyDevice}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  const newSafetyDevice = listingData.safetyDevice?.includes(
                    item.value,
                  )
                    ? listingData.safetyDevice?.filter(
                        (device) => device !== item.value,
                      )
                    : [...(listingData.safetyDevice || []), item.value];
                  dispatchListingData({
                    ...listingData,
                    safetyDevice: newSafetyDevice,
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
                    borderColor: listingData.safetyDevice?.includes(item.value)
                      ? "#888"
                      : colors.border1,
                    height: 85,
                    backgroundColor: listingData.safetyDevice?.includes(
                      item.value,
                    )
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

        <View style={{ paddingBottom: 200 }} />
      </ScrollView>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={0} stepCount={6} />
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
    minHeight: 10,
    minWidth: 10,
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

export default AmenityScreen;
