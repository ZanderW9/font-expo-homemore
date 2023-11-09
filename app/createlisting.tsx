import { View } from "@components/Themed";
import { useASGet } from "@config/hooks/storage";
import { ListItem, Input, ButtonGroup } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";

const UploadImageScreen = () => {
  const { storedValue: initialLocation } = useASGet("userLocation");
  console.log(initialLocation);

  const [images, setImages] = useState([]);
  const [expanded, setExpanded] = React.useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [citySuburb, setCitySuburb] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postCode, setPostCode] = useState("");

  console.log(
    title,
    description,
    price,
    country,
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
      console.log(result.assets.length);
      result.assets.map((asset) => {
        console.log(asset.uri);
        setImages([...images, asset.uri]);
      });
    }
  };

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
      <ListItem.Accordion
        content={
          <>
            <ListItem.Content>
              <ListItem.Title>Basic Infomation</ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <View style={styles.contentWrapper}>
          <Input
            label="Add a title"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setTitle(text);
            }}
          />
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
        </View>
      </ListItem.Accordion>
      <ListItem.Accordion
        content={
          <>
            <ListItem.Content>
              <ListItem.Title>Search your address</ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <View style={styles.contentWrapper}>
          <Input
            label="Country / Region"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setCountry(text);
            }}
          />
          <Input
            label="Unit / Building"
            placeholder="Unit, level, etc. (if applicable)"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setCountry(text);
            }}
          />

          <Input
            label="Street address"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setStreetAddress(text);
            }}
          />
          <Input
            label="City / Suburb"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setCitySuburb(text);
            }}
          />
          <Input
            label="State / Province / Region"
            labelStyle={{ color: "gray" }}
            containerStyle={styles.inputWrapper}
            inputContainerStyle={styles.inputContainer}
            onChangeText={(text) => {
              setStateProvince(text);
            }}
          />
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
        </View>
      </ListItem.Accordion>
      <ListItem.Accordion
        content={
          <>
            <ListItem.Content>
              <ListItem.Title>More Information</ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <View style={styles.contentWrapper}>
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
          />
          <Text style={styles.title}>Room information</Text>
        </View>
      </ListItem.Accordion>
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
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    padding: 2,
    marginHorizontal: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "gray",
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
    borderColor: "gray",
    borderRadius: 5,
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
});

export default UploadImageScreen;
