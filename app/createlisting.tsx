import { View } from "@components/Themed";
import { useGetLocalItem } from "@config/hooks/storage";
import { ListItem, Input, ButtonGroup, Button } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const UploadImageScreen = () => {
  const { storedValue: initialLocation } = useGetLocalItem("userLocation");
  console.log(initialLocation);

  const [images, setImages] = useState([]);
  const [expanded, setExpanded] = React.useState([0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  // const [selectedCountry, setSelectedCountry] = useState();
  const [unit, setUnit] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [citySuburb, setCitySuburb] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postCode, setPostCode] = useState("");

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("au");
  const [selectedCountry, setSelectedCountry] = useState([
    { label: "Australia", value: "au" },
    { label: "China", value: "cn" },
  ]);

  console.log(
    title,
    description,
    price,
    selectedCountry,
    unit,
    streetAddress,
    citySuburb,
    stateProvince,
    postCode,
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = [];
      result.assets.map((asset) => {
        console.log(asset.uri);
        // setImages([...images, asset.uri]);
        newImages.push(asset.uri);
      });
      setImages([...images, ...newImages]);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      country: "",
      streetAddress: "",
      citySuburb: "",
      stateProvince: "",
      postCode: "",
    },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imagesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <TouchableOpacity key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.contentWrapper}>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title>Basic Infomation</ListItem.Title>
              </ListItem.Content>
            </>
          }
          containerStyle={{ borderRadius: 15 }}
          isExpanded={expanded.includes(0)}
          onPress={() => {
            if (expanded.includes(0)) {
              setExpanded(expanded.filter((item) => item !== 0));
            } else {
              setExpanded([0]);
            }
          }}
        >
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Add a title"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                onChangeText={(text) => {
                  setTitle(text);
                }}
              />
            )}
            name="title"
            rules={{ required: true }}
          />
          {errors.title && <Text>This is required.</Text>}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Add a description"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{
                  height: 100,
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                }}
                multiline
                numberOfLines={4}
                onChangeText={(text) => {
                  setDescription(text);
                }}
              />
            )}
            name="description"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Add a price / day"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                keyboardType="numeric"
                onChangeText={(text) => {
                  text = text.replace(/[^0-9]/g, "");
                  setPrice(parseInt(text));
                }}
              />
            )}
            name="price"
            rules={{ required: true }}
          />
        </ListItem.Accordion>
      </View>

      <View style={styles.contentWrapper}>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title>Search your address</ListItem.Title>
              </ListItem.Content>
            </>
          }
          containerStyle={{ borderRadius: 15 }}
          isExpanded={expanded.includes(1)}
          onPress={() => {
            if (expanded.includes(1)) {
              setExpanded(expanded.filter((item) => item !== 1));
            } else {
              setExpanded([1]);
            }
          }}
        >
          <DropDownPicker
            open={open}
            value={country}
            items={selectedCountry}
            setOpen={setOpen}
            setValue={setCountry}
            setItems={setSelectedCountry}
            containerStyle={{
              width: "94.5%",
              justifyContent: "center",
              alignSelf: "center",
            }}
            style={styles.pickerContainer}
            textStyle={{
              fontSize: 16,
            }}
            onSelectItem={(item) => {
              console.log(item);
            }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Unit / Building"
                placeholder="Unit, level, etc. (if applicable)"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                onChangeText={(text) => {
                  setUnit(text);
                }}
              />
            )}
            name="unit"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Street address"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                onChangeText={(text) => {
                  setStreetAddress(text);
                }}
              />
            )}
            name="streetAddress"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="City / Suburb"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                onChangeText={(text) => {
                  setCitySuburb(text);
                }}
              />
            )}
            name="citySuburb"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="State / Province / Region"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                onChangeText={(text) => {
                  setStateProvince(text);
                }}
              />
            )}
            name="stateProvince"
            rules={{ required: true }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Postcode"
                labelStyle={{ color: "gray" }}
                keyboardType="numeric"
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                onChangeText={(text) => {
                  setPostCode(text);
                }}
              />
            )}
            name="postCode"
            rules={{ required: true }}
          />
        </ListItem.Accordion>
      </View>

      <View style={styles.contentWrapper}>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title>More Information</ListItem.Title>
              </ListItem.Content>
            </>
          }
          containerStyle={{ borderRadius: 15 }}
          isExpanded={expanded.includes(2)}
          onPress={() => {
            if (expanded.includes(2)) {
              setExpanded(expanded.filter((item) => item !== 2));
            } else {
              setExpanded([2]);
            }
          }}
        >
          <Text style={styles.title}>Choose your place type: </Text>
          <ButtonGroup
            buttons={[
              "House",
              "Apartment",
              "Barn",
              "Cabin",
              "Camper/RV",
              "Farm",
              "Tent",
              "Tiny house",
            ]}
            selectedIndex={selectedIndex}
            vertical
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>What type of place will guests have?</Text>
          <ButtonGroup
            buttons={["An entire place", "A room"]}
            selectedIndex={selectedIndex}
            vertical
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>Room information</Text>
        </ListItem.Accordion>
      </View>
      <Button
        title="Submit"
        size="lg"
        radius="sm"
        type="solid"
        containerStyle={{
          margin: 30,
          marginBottom: 100,
          width: 200,
          alignSelf: "center",
        }}
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imagesContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 10,
  },
  imageContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 130,
    height: 130,
  },
  plusIcon: {
    fontSize: 50,
    color: "#ccc",
  },
  contentWrapper: {
    borderRadius: 8,
    padding: 2,
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 3,
    shadowRadius: 2.22,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: "#000",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -10,
  },
  houseTypeContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderWidth: 0,
  },
  buttonContainerStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    borderRadius: 6,
    margin: 5,
    width: "30%",
    height: 50,
  },
  buttonStyle: {
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    paddingLeft: 16,
    paddingTop: 10,
  },
  pickerContainer: {
    // width: "94.5%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
    marginTop: 10,
  },
});

export default UploadImageScreen;
