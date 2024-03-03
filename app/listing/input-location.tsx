import { gql, useMutation } from "@apollo/client";
import { View, SafeAreaView, Text } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import { useThemedColors } from "@constants/theme";
import { Button, Input } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { showMessage } from "react-native-flash-message";

const updateListingMutation = gql`
  mutation UpdateListing($updateListingId: String!, $address: Json) {
    updateListing(id: $updateListingId, address: $address) {
      id
    }
  }
`;

function InputLocation() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);

  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    listingData.address.country,
  );
  const [country, setCountry] = useState([
    { label: "Australia", value: "Australia" },
    { label: "China", value: "China" },
  ]);

  const submitHandler = async () => {
    if (selectedCountry === "") {
      showMessage({
        message: "Please select a country",
        type: "danger",
      });
      return;
    }
    if (listingData.address.street === "") {
      showMessage({
        message: "Please enter street",
        type: "danger",
      });
      return;
    }
    if (listingData.address.city === "") {
      showMessage({
        message: "Please enter city",
        type: "danger",
      });
      return;
    }
    if (listingData.address.state === "") {
      showMessage({
        message: "Please enter state",
        type: "danger",
      });
      return;
    }
    if (listingData.address.postCode === "") {
      showMessage({
        message: "Please enter postcode",
        type: "danger",
      });
      return;
    }

    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        address: listingData.address,
      },
    });
    router.navigate("/listing/location");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerShown: false,
        }}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            marginVertical: -15,
            marginHorizontal: 10,
          }}
        >
          Country
        </Text>
        <DropDownPicker
          open={open}
          value={selectedCountry}
          items={country}
          setOpen={setOpen}
          setValue={setSelectedCountry}
          setItems={setCountry}
          dropDownContainerStyle={{
            borderWidth: 1,
            borderColor: colors.border1,
            backgroundColor: colors.back1,
          }}
          containerStyle={{
            width: "94.5%",
            justifyContent: "center",
            alignSelf: "center",
            borderWidth: 0,
            margin: 15,
            backgroundColor: colors.back1,
          }}
          style={[
            styles.pickerContainer,
            { backgroundColor: colors.back1, borderColor: colors.border1 },
          ]}
          textStyle={{
            fontSize: 16,
            color: colors.text,
          }}
          onSelectItem={(item) => {
            setSelectedCountry(item.value);
          }}
        />

        <Input
          label="Unit / Building"
          placeholder="Unit, level, etc. (if applicable)"
          labelStyle={{
            color: colors.text,
            fontWeight: "normal",
          }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          value={listingData.address.unit}
          inputStyle={{ color: colors.text }}
          onChangeText={(text) => {
            dispatchListingData({
              ...listingData,
              address: { ...listingData.address, unit: text },
            });
          }}
        />
        <Input
          label="Street"
          placeholder="Street"
          labelStyle={{ color: colors.text, fontWeight: "normal" }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          value={listingData.address.street}
          inputStyle={{ color: colors.text }}
          onChangeText={(text) => {
            dispatchListingData({
              ...listingData,
              address: { ...listingData.address, street: text },
            });
          }}
        />
        <Input
          label="City"
          placeholder="City"
          labelStyle={{ color: colors.text, fontWeight: "normal" }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          value={listingData.address.city}
          inputStyle={{ color: colors.text }}
          onChangeText={(text) => {
            dispatchListingData({
              ...listingData,
              address: { ...listingData.address, city: text },
            });
          }}
        />
        <Input
          label="State"
          placeholder="State"
          labelStyle={{ color: colors.text, fontWeight: "normal" }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          value={listingData.address.state}
          inputStyle={{ color: colors.text }}
          onChangeText={(text) => {
            dispatchListingData({
              ...listingData,
              address: { ...listingData.address, state: text },
            });
          }}
        />
        <Input
          label="Postcode"
          placeholder="Postcode"
          labelStyle={{ color: colors.text, fontWeight: "normal" }}
          containerStyle={styles.inputWrapper}
          inputContainerStyle={[
            styles.inputContainer,
            { borderColor: colors.border1 },
          ]}
          value={listingData.address.postCode}
          inputStyle={{ color: colors.text }}
          onChangeText={(text) => {
            dispatchListingData({
              ...listingData,
              address: { ...listingData.address, postCode: text },
            });
          }}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginHorizontal: 20,
            justifyContent: "center",
          }}
          theme={{ background: "back1" }}
        >
          <Button
            title="Looks good"
            buttonStyle={{
              backgroundColor: "rgb(236, 76, 96)",
              height: 50,
              width: 300,
              borderRadius: 7,
            }}
            onPress={submitHandler}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default InputLocation;
