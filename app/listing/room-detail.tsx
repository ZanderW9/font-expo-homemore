import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView, ScrollView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Button, CheckBox } from "@rneui/themed";
import { router, Stack, useNavigation } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

DropDownPicker.setListMode("SCROLLVIEW");

const updateListingMutation = gql`
  mutation UpdateListing(
    $updateListingId: String!
    $bedRoomDetails: [Json]
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      bedRoomDetails: $bedRoomDetails
      published: $published
    ) {
      id
    }
  }
`;

function RoomDetailScreen() {
  const { listingData, dispatchListingData } = useCreateListingContext();
  const colors = useThemedColors();

  const [updateListingFunction] = useMutation(updateListingMutation);

  const [open, setOpen] = useState([]);
  const [bedType, setBedType] = useState([
    { label: "Queen size", value: "queen" },
    { label: "King size", value: "king" },
    { label: "Single size", value: "single" },
    { label: "Double size", value: "double" },
    { label: "Sofa bed", value: "sofaBed" },
  ]);

  const nextHandler = async () => {
    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        bedRoomDetails: listingData.bedRoomDetails,
      },
    });
    router.navigate("/listing/step-2");
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

  const addBedroomHandler = async () => {
    setOpen([...open, false]);
    const newBedroom = {
      bed: { bedType: "", bedCount: 1 },
      toilet: false,
      bath: false,
    };
    dispatchListingData({
      ...listingData,
      bedRoomDetails: [...listingData.bedRoomDetails, newBedroom],
    });
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
        <Text style={styles.title}>Add details for your bedroom</Text>
        <Text style={styles.subtitle}>
          Add more details about the bedroom, such as the bed size, bathroom,
          and toilet
        </Text>

        <Button
          title="Add Bedroom"
          type="outline"
          buttonStyle={{
            borderColor: "rgb(236, 76, 96)",
            borderRadius: 7,
            marginVertical: 20,
          }}
          titleStyle={{
            color: "rgb(236, 76, 96)",
            alignSelf: "center",
            justifyContent: "center",
          }}
          onPress={addBedroomHandler}
        />

        <ScrollView>
          {listingData.bedRoomDetails.map((bedroom, index) => (
            <View
              key={index}
              style={{ ...styles.roomBox, zIndex: (1 - index) * 10 }}
            >
              {/* 卧室标题 */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.roomTitle}>Bedroom {index + 1}</Text>
                <Ionicons
                  name="trash"
                  size={24}
                  color="red"
                  onPress={() => {
                    dispatchListingData({
                      ...listingData,
                      bedRoomDetails: [
                        ...listingData.bedRoomDetails.slice(0, index),
                        ...listingData.bedRoomDetails.slice(index + 1),
                      ],
                    });
                  }}
                />
              </View>
              {/* 卧室信息 */}

              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  paddingBottom: 10,
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.checkbox}>
                  <Text>Toilet:</Text>
                  <CheckBox
                    checkedColor="rgb(236, 76, 96)"
                    containerStyle={{
                      margin: 0,
                      padding: 0,
                      backgroundColor: "transparent",
                    }}
                    checked={bedroom.toilet}
                    onPress={() => {
                      dispatchListingData({
                        ...listingData,
                        bedRoomDetails: [
                          ...listingData.bedRoomDetails.slice(0, index),
                          {
                            ...bedroom,
                            toilet: !bedroom.toilet,
                          },
                          ...listingData.bedRoomDetails.slice(index + 1),
                        ],
                      });
                    }}
                  />
                </View>

                <View style={styles.checkbox}>
                  <Text>Bath:</Text>
                  <CheckBox
                    checkedColor="rgb(236, 76, 96)"
                    containerStyle={{
                      margin: 0,
                      padding: 0,
                      backgroundColor: "transparent",
                    }}
                    checked={bedroom.bath}
                    onPress={() => {
                      dispatchListingData({
                        ...listingData,
                        bedRoomDetails: [
                          ...listingData.bedRoomDetails.slice(0, index),
                          {
                            ...bedroom,
                            bath: !bedroom.bath,
                          },
                          ...listingData.bedRoomDetails.slice(index + 1),
                        ],
                      });
                    }}
                  />
                </View>
              </View>

              <View style={styles.bedRoomInfo}>
                <Text>Bed Type:</Text>
                <DropDownPicker
                  open={open[index]}
                  value={bedroom.bed.bedType}
                  items={bedType}
                  setOpen={(value) =>
                    setOpen([
                      ...open.slice(0, index),
                      value,
                      ...open.slice(index + 1),
                    ])
                  }
                  zIndex={9999}
                  setItems={setBedType}
                  dropDownContainerStyle={{
                    borderWidth: 1,
                    borderColor: colors.border1,
                    backgroundColor: colors.back1,
                  }}
                  containerStyle={{
                    width: "40%",
                    justifyContent: "center",
                    alignSelf: "center",
                    borderWidth: 0,
                    zIndex: 1000,
                    marginHorizontal: 10,
                    backgroundColor: colors.back1,
                  }}
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: colors.back1,
                      borderColor: colors.border1,
                    },
                  ]}
                  textStyle={{
                    fontSize: 14,
                    color: colors.text,
                  }}
                  onSelectItem={(item) => {
                    dispatchListingData({
                      ...listingData,
                      bedRoomDetails: [
                        ...listingData.bedRoomDetails.slice(0, index),
                        {
                          ...bedroom,
                          bed: {
                            ...bedroom.bed,
                            bedType: item.value,
                          },
                        },
                        ...listingData.bedRoomDetails.slice(index + 1),
                      ],
                    });
                  }}
                />

                <Ionicons
                  style={{ marginRight: 10, marginLeft: 10 }}
                  name="remove-circle-outline"
                  size={24}
                  color="gray"
                  onPress={() => {
                    if (bedroom.bed.bedCount > 1)
                      dispatchListingData({
                        ...listingData,
                        bedRoomDetails: [
                          ...listingData.bedRoomDetails.slice(0, index),
                          {
                            ...bedroom,
                            bed: {
                              ...bedroom.bed,
                              bedCount: bedroom.bed.bedCount - 1,
                            },
                          },
                          ...listingData.bedRoomDetails.slice(index + 1),
                        ],
                      });
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 0,
                    width: 35,
                    textAlign: "center",
                  }}
                >
                  {bedroom.bed.bedCount}
                </Text>
                <Ionicons
                  style={{ marginRight: 10, marginLeft: 10 }}
                  name="add-circle-outline"
                  size={24}
                  color="gray"
                  onPress={() => {
                    if (bedroom.bed.bedCount < 16)
                      dispatchListingData({
                        ...listingData,
                        bedRoomDetails: [
                          ...listingData.bedRoomDetails.slice(0, index),
                          {
                            ...bedroom,
                            bed: {
                              ...bedroom.bed,
                              bedCount: bedroom.bed.bedCount + 1,
                            },
                          },
                          ...listingData.bedRoomDetails.slice(index + 1),
                        ],
                      });
                  }}
                />
              </View>
            </View>
          ))}
          <View
            style={{
              marginBottom: 200,
            }}
          />
        </ScrollView>
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={5} stepCount={6} />
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
  roomBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  bedRoomInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.5,
  },
});

export default RoomDetailScreen;
