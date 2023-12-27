import { gql, useMutation, useQuery } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import { View } from "@components/Themed";
// import { useGetLocalItem } from "@config/hooks/storage";
import { compressImage } from "@config/media";
import { signImageUrl, deleteImageFromS3 } from "@config/requests";
import { uploadImage } from "@config/s3";
import { Ionicons } from "@expo/vector-icons";
import { ListItem, Input, ButtonGroup, Button, Dialog } from "@rneui/themed";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import DropDownPicker from "react-native-dropdown-picker";
DropDownPicker.setListMode("SCROLLVIEW");

const listingDetailQuery = gql`
  query Query($ids: [Int]) {
    allListings(ids: $ids) {
      id
      title
      description
      images {
        url
        smallUrl
        thumbhash
        ratio
        width
        height
      }
      price
      address
      coordinate
      favorited
      availability
      unavailability
      createdAt
      publishAt
      placeType
      rentType
      roomDetails
      deviceType
      standoutType
      safetyDeviceType
      guestType
      meta
      owner {
        userName
      }
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
        }
        subReviews {
          text
          id
          createdAt
          sender {
            id
            userName
          }
        }
      }
    }
  }
`;

const updateListingMutation = gql`
  mutation Mutation(
    $updateListingId: Int!
    $title: String
    $description: String
    $images: [String]
    $price: Int
    $address: Json
    $published: Boolean
    $finished: Boolean
    $placeType: String
    $rentType: String
    $roomDetails: Json
    $deviceType: [String]
    $standoutType: [String]
    $safetyDeviceType: [String]
    $guestType: [String]
    $availability: [String]
  ) {
    updateListing(
      id: $updateListingId
      title: $title
      description: $description
      images: $images
      price: $price
      address: $address
      published: $published
      finished: $finished
      placeType: $placeType
      rentType: $rentType
      roomDetails: $roomDetails
      deviceType: $deviceType
      standoutType: $standoutType
      safetyDeviceType: $safetyDeviceType
      guestType: $guestType
      availability: $availability
    ) {
      id
    }
  }
`;

function getKeyByValue(
  dictionary: { [key: number]: string },
  value: string,
): number | undefined {
  const keys = Object.keys(dictionary).map(Number);
  const foundKey = keys.find((key) => dictionary[key] === value);
  return foundKey;
}

const deleteListingMutation = gql`
  mutation Mutation($deleteListingId: Int!) {
    deleteListing(id: $deleteListingId) {
      id
    }
  }
`;

const CreateListingScreen = () => {
  const { httpLinkUrl } = useContext(GlobalContext);
  // const { storedValue: initialLocation } = useGetLocalItem("userLocation");
  // console.log(initialLocation);
  const { listingId } = useLocalSearchParams();
  const [updateListingFunction] = useMutation(updateListingMutation);
  const [deleteListingFunction] = useMutation(deleteListingMutation);
  const { data: gqlData, loading } = useQuery(listingDetailQuery, {
    variables: { ids: [parseInt(listingId)] },
    errorPolicy: "all",
  });
  console.log("gqlData:", gqlData);
  const [expanded, setExpanded] = React.useState([0]);
  const [formComplete, setFormComplete] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [s3Images, setS3Images] = useState([]);
  const [oldS3Images, setOldS3Images] = useState([]);
  const [title, setTitle] = useState("");
  const [oldTitle, setOldTitle] = useState("");
  const [description, setDescription] = useState("");
  const [oldDescription, setOldDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [oldPrice, setOldPrice] = useState<number | null>(null);
  const [unit, setUnit] = useState("");
  const [oldUnit, setOldUnit] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [oldStreetAddress, setOldStreetAddress] = useState("");
  const [citySuburb, setCitySuburb] = useState("");
  const [oldCitySuburb, setOldCitySuburb] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [oldStateProvince, setOldStateProvince] = useState("");
  const [postCode, setPostCode] = useState("");
  const [oldPostCode, setOldPostCode] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("au");
  const [country, setCountry] = useState([
    { label: "Australia", value: "au" },
    { label: "China", value: "cn" },
  ]);

  const [guestNum, setGuestNum] = useState(0);
  const [oldGuestNum, setOldGuestNum] = useState(0);
  const [bedroomNum, setBedroomNum] = useState(0);
  const [oldBedroomNum, setOldBedroomNum] = useState(0);
  const [bedNum, setBedNum] = useState(0);
  const [oldBedNum, setOldBedNum] = useState(0);
  const [bathroomNum, setBathroomNum] = useState(0);
  const [oldBathroomNum, setOldBathroomNum] = useState(0);

  const roomDetails = {
    Guests: guestNum,
    Bedrooms: bedroomNum,
    Bed: bedNum,
    Bathrooms: bathroomNum,
  };

  const [placeType, setPlaceType] = useState(null);
  const [rentType, setRentType] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const [nightStayCount, setNightStayCount] = useState(0);

  const placeTypeDict = {
    0: "House",
    1: "Apartment",
    2: "Barn",
    3: "Cabin",
    4: "Camper/RV",
    5: "Farm",
    6: "Tent",
    7: "TinyHouse",
  };

  const rentTypeDict = {
    0: "entirePlace",
    1: "ARoom",
  };

  const guestTypeDict = {
    0: "Couple",
    1: "Male",
    2: "Female",
    3: "Family",
    4: "All",
  };

  const deviceTypeList = [
    "Wi-Fi",
    "TV",
    "Kitchen",
    "Washer",
    "Free parking",
    "Paid parking",
    "Air conditioning",
    "Dedicated workspace",
  ];

  const deviceTypeDict = {
    0: "Wifi",
    1: "TV",
    2: "Kitchen",
    3: "Washer",
    4: "FreeParking",
    5: "PaidParking",
    6: "AirConditioning",
    7: "DedicatedWorkspace",
  };

  const standoutTypeList = [
    "Near the bus station",
    "Near the metro station",
    "Near the train station",
    "Park access",
  ];

  const standoutTypeDict = {
    0: "NearBusStation",
    1: "NearMetroStation",
    2: "NearTrainStation",
    3: "ParkAccess",
  };

  const safetyDeviceTypeList = [
    "Smoke alarm",
    "First aid kit",
    "Fire extinguisher",
    "Carbon monoxide alarm",
  ];

  const safetyDeviceTypeDict = {
    0: "SmokeAlarm",
    1: "FirstAidKit",
    2: "FireExtinguisher",
    3: "CarbonMonoxideAlarm",
  };

  const [deviceType, setDeviceType] = useState([]);
  const [standoutType, setStandoutType] = useState([]);
  const [safetyDeviceType, setSafetyDeviceType] = useState([]);
  const [guestType, setGuestType] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [oldSelectedDates, setOldSelectedDates] = useState([]);

  const toggleStartingEndingDays = (day) => {
    if (day.dateString < today) {
      // 今天之前的日期不进行处理
      return;
    }

    if (selectedDates.length === 1 && selectedDates[0] === day.dateString) {
      // 点击同一天两次，该天既是startingDay也是endingDay
      setSelectedDates([day.dateString]);
      setNightStayCount(0);
    } else if (selectedDates.length === 0) {
      setSelectedDates([day.dateString]);
      setNightStayCount(0);
    } else if (selectedDates.length === 1) {
      const firstSelectedDate = selectedDates[0];
      const secondSelectedDate = day.dateString;

      if (firstSelectedDate > secondSelectedDate) {
        setSelectedDates([secondSelectedDate]);
        setNightStayCount(0);
      } else {
        const datesBetween = getDatesBetween(
          firstSelectedDate,
          secondSelectedDate,
        );
        setSelectedDates([
          firstSelectedDate,
          ...datesBetween,
          secondSelectedDate,
        ]);
        setNightStayCount(datesBetween.length + 1);
      }
    } else {
      setSelectedDates([day.dateString]);
      setNightStayCount(0);
    }
  };

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // setNightStayCount(dates.length - 1);

    return dates.slice(1, -1);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const newS3Images: string[] = [];

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(
          result.assets.map(async (asset) => {
            const fileName = asset.uri.split("/").pop();
            const fileType = fileName?.split(".").pop();
            const res = await signImageUrl(httpLinkUrl, fileName, fileType);
            if (res.ok) {
              const { data } = res;
              const { signedUrl, objectUrl } = data;
              newS3Images.push(objectUrl);
              // 通过 signedUrl 上传图片
              const compressedAsset = await compressImage(asset.uri);
              await uploadImage(signedUrl, fileType, compressedAsset);
            }
          }),
        );
        setS3Images([...s3Images, ...newS3Images]);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      country: "",
      unit: "",
      streetAddress: "",
      citySuburb: "",
      stateProvince: "",
      postCode: "",
      rentType: "",
      placeType: "",
    },
  });

  const deleteImage = (index: number) => {
    setShowDeleteDialog(true);
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    deleteImageFromS3(httpLinkUrl, s3Images[deleteIndex]);
    const updatedS3Images = [...s3Images];
    updatedS3Images.splice(deleteIndex, 1);
    setS3Images(updatedS3Images);
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const saveHandler = () => {
    updateListingFunction({
      variables: {
        updateListingId: parseInt(listingId),
        title,
        description,
        images: s3Images,
        price,
        address: {
          country: selectedCountry,
          unit,
          street: streetAddress,
          city: citySuburb,
          state: stateProvince,
          postCode,
        },
        published: false,
        finished: false,
        placeType: placeType !== null ? placeTypeDict[placeType] : null,
        rentType: rentType !== null ? rentTypeDict[rentType] : null,
        roomDetails,
        deviceType: deviceType?.map((index) => deviceTypeDict[index]),
        standoutType: standoutType?.map((index) => standoutTypeDict[index]),
        safetyDeviceType: safetyDeviceType?.map(
          (index) => safetyDeviceTypeDict[index],
        ),
        guestType: guestType?.map((index) => guestTypeDict[index]),
        availability: selectedDates,
      },
    });
    router.back();
  };

  const publishHandler = () => {
    updateListingFunction({
      variables: {
        updateListingId: parseInt(listingId),
        title,
        description,
        images: s3Images,
        price,
        address: {
          country: selectedCountry,
          unit,
          street: streetAddress,
          city: citySuburb,
          state: stateProvince,
          postCode,
        },
        published: true,
        finished: true,
        placeType: placeType !== null ? placeTypeDict[placeType] : null,
        rentType: rentType !== null ? rentTypeDict[rentType] : null,
        roomDetails,
        deviceType: deviceType.map((index) => deviceTypeDict[index]),
        standoutType: standoutType.map((index) => standoutTypeDict[index]),
        safetyDeviceType: safetyDeviceType.map(
          (index) => safetyDeviceTypeDict[index],
        ),
        guestType: guestType.map((index) => guestTypeDict[index]),
        availability: selectedDates,
      },
    });
    router.back();
  };

  useEffect(() => {
    // 这里的if可以改为lodash的方法
    if (!loading && gqlData && gqlData?.allListings[0]) {
      const images = gqlData?.allListings[0]?.images.map((image) => image.url);
      setS3Images(images);
      setOldS3Images(images);
      setTitle(gqlData?.allListings[0]?.title);
      setOldTitle(gqlData?.allListings[0]?.title);
      setDescription(gqlData?.allListings[0]?.description);
      setOldDescription(gqlData?.allListings[0]?.description);
      setPrice(gqlData?.allListings[0]?.price);
      setOldPrice(gqlData?.allListings[0]?.price);
      setUnit(gqlData?.allListings[0]?.address.unit);
      setOldUnit(gqlData?.allListings[0]?.address.unit);
      setStreetAddress(gqlData?.allListings[0]?.address.street);
      setOldStreetAddress(gqlData?.allListings[0]?.address.street);
      setCitySuburb(gqlData?.allListings[0]?.address.city);
      setOldCitySuburb(gqlData?.allListings[0]?.address.city);
      setStateProvince(gqlData?.allListings[0]?.address.state);
      setOldStateProvince(gqlData?.allListings[0]?.address.state);
      setPostCode(gqlData?.allListings[0]?.address.postCode);
      setOldPostCode(gqlData?.allListings[0]?.address.postCode);
      setSelectedCountry(gqlData?.allListings[0]?.address.country);
      setGuestNum(gqlData?.allListings[0]?.roomDetails.Guests);
      setOldGuestNum(gqlData?.allListings[0]?.roomDetails.Guests);
      setBedroomNum(gqlData?.allListings[0]?.roomDetails.Bedrooms);
      setOldBedroomNum(gqlData?.allListings[0]?.roomDetails.Bedrooms);
      setBedNum(gqlData?.allListings[0]?.roomDetails.Bed);
      setOldBedNum(gqlData?.allListings[0]?.roomDetails.Bed);
      setBathroomNum(gqlData?.allListings[0]?.roomDetails.Bathrooms);
      setOldBathroomNum(gqlData?.allListings[0]?.roomDetails.Bathrooms);
      setPlaceType(
        getKeyByValue(placeTypeDict, gqlData?.allListings[0]?.placeType),
      );
      setRentType(
        getKeyByValue(rentTypeDict, gqlData?.allListings[0]?.rentType),
      );
      setDeviceType(
        gqlData?.allListings[0]?.deviceType.map((item) =>
          getKeyByValue(deviceTypeDict, item),
        ),
      );
      setStandoutType(
        gqlData?.allListings[0]?.standoutType.map((item) =>
          getKeyByValue(standoutTypeDict, item),
        ),
      );
      setSafetyDeviceType(
        gqlData?.allListings[0]?.safetyDeviceType.map((item) =>
          getKeyByValue(safetyDeviceTypeDict, item),
        ),
      );
      setGuestType(
        gqlData?.allListings[0]?.guestType.map((item) =>
          getKeyByValue(guestTypeDict, item),
        ),
      );
      setSelectedDates(gqlData?.allListings[0]?.availability);
      setOldSelectedDates(gqlData?.allListings[0]?.availability);
    }
  }, [loading, gqlData]);

  useEffect(() => {
    const isFormComplete =
      s3Images?.length > 0 &&
      title !== "" &&
      description !== "" &&
      (price ? price > 0 : false) &&
      selectedCountry !== "" &&
      streetAddress !== "" &&
      citySuburb !== "" &&
      stateProvince !== "" &&
      postCode !== "" &&
      guestNum >= 0 &&
      bedroomNum >= 0 &&
      bedNum >= 0 &&
      bathroomNum >= 0 &&
      selectedDates.length > 0;
    setFormComplete(isFormComplete);
    const isChange =
      s3Images !== oldS3Images ||
      title !== oldTitle ||
      description !== oldDescription ||
      price !== oldPrice ||
      unit !== oldUnit ||
      streetAddress !== oldStreetAddress ||
      citySuburb !== oldCitySuburb ||
      stateProvince !== oldStateProvince ||
      postCode !== oldPostCode ||
      guestNum !== oldGuestNum ||
      bedroomNum !== oldBedroomNum ||
      bedNum !== oldBedNum ||
      bathroomNum !== oldBathroomNum ||
      selectedDates !== oldSelectedDates;
    setIsChange(isChange);
  }, [
    s3Images,
    title,
    description,
    price,
    selectedCountry,
    streetAddress,
    stateProvince,
    postCode,
    guestNum,
    bedroomNum,
    bedNum,
    bathroomNum,
    selectedDates,
  ]);

  const handleExit = () => {
    if (isChange) {
      setShowSaveDraftDialog(true);
    } else {
      router.back();
    }
  };

  const handleDelete = () => {
    deleteListingFunction({
      variables: {
        deleteListingId: parseInt(listingId),
      },
    });
    router.back();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleExit();
        return true; // Prevent default behavior (exit the app)
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [isChange]);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={!open}
    >
      <Stack.Screen
        options={{
          title: "Create",
          headerLeft: () => (
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="black"
              style={{ marginRight: 30 }}
              onPress={handleExit}
            />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginRight: 10,
              }}
              onPress={saveHandler}
            >
              <Text style={{ fontSize: 16, marginTop: 5 }}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.imagesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {s3Images?.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => deleteImage(index)}
            >
              <Image source={{ uri: image }} style={styles.image} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 删除确认弹窗 */}
      <Dialog
        isVisible={showDeleteDialog}
        onBackdropPress={cancelDelete}
        overlayStyle={{ borderRadius: 10 }}
      >
        <Text>Are you sure you want to delete this image?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Dialog.Button title="Cancel" onPress={cancelDelete} />
          <Dialog.Button
            title="Delete"
            titleStyle={{ color: "red" }}
            onPress={confirmDelete}
          />
        </View>
      </Dialog>

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
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                }}
              />
            )}
            name="title"
          />
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
                textAlignVertical="top"
                numberOfLines={4}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                }}
              />
            )}
            name="description"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="$0"
                label="Add a price / day"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                keyboardType="numeric"
                value={price ? price.toString() : ""}
                onChangeText={(text) => {
                  text = text.replace(/[^0-9]/g, "");
                  setPrice(text ? parseInt(text) : null);
                }}
              />
            )}
            name="price"
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
            value={selectedCountry}
            items={country}
            setOpen={setOpen}
            setValue={setSelectedCountry}
            setItems={setCountry}
            dropDownContainerStyle={{
              borderWidth: 1,
              borderColor: "#c4c4c4",
            }}
            containerStyle={{
              width: "94.5%",
              justifyContent: "center",
              alignSelf: "center",
              borderWidth: 0,
              margin: 15,
            }}
            style={styles.pickerContainer}
            textStyle={{
              fontSize: 16,
            }}
            onSelectItem={(item) => {
              setSelectedCountry(item.value);
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
                value={unit}
                onChangeText={(text) => {
                  setUnit(text);
                }}
              />
            )}
            name="unit"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Street address"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                value={streetAddress}
                onChangeText={(text) => {
                  setStreetAddress(text);
                }}
              />
            )}
            name="streetAddress"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="City / Suburb"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                value={citySuburb}
                onChangeText={(text) => {
                  setCitySuburb(text);
                }}
              />
            )}
            name="citySuburb"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="State / Province / Region"
                labelStyle={{ color: "gray" }}
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                value={stateProvince}
                onChangeText={(text) => {
                  setStateProvince(text);
                }}
              />
            )}
            name="stateProvince"
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
                value={postCode}
                onChangeText={(text) => {
                  setPostCode(text);
                }}
              />
            )}
            name="postCode"
          />
        </ListItem.Accordion>
      </View>

      <View style={styles.contentWrapper}>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title>Place Information</ListItem.Title>
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
            selectedIndex={placeType}
            vertical
            onPress={(value) => {
              setPlaceType(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>What type of place will guests have?</Text>
          <ButtonGroup
            buttons={["An entire place", "A room"]}
            selectedIndex={rentType}
            vertical
            onPress={(value) => {
              setRentType(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>Room information</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.title}>Guests</Text>
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="remove-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (guestNum > 0) setGuestNum(guestNum - 1);
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 10,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {guestNum}
              </Text>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="add-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (guestNum < 29) setGuestNum(guestNum + 1);
                }}
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.title}>Bedrooms</Text>
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="remove-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (bedroomNum > 0) setBedroomNum(bedroomNum - 1);
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 10,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {bedroomNum}
              </Text>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="add-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (bedroomNum < 29) setBedroomNum(bedroomNum + 1);
                }}
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.title}>Bed</Text>
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="remove-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (bedNum > 0) setBedNum(bedNum - 1);
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 10,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {bedNum}
              </Text>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="add-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (bedNum < 29) setBedNum(bedNum + 1);
                }}
              />
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.title}>Bathrooms</Text>
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="remove-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (bathroomNum > 0) setBathroomNum(bathroomNum - 1);
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 10,
                  width: 20,
                  textAlign: "center",
                }}
              >
                {bathroomNum}
              </Text>
              <Ionicons
                style={{ marginRight: 10, marginTop: 10, marginLeft: 10 }}
                name="add-circle-outline"
                size={24}
                color="gray"
                onPress={() => {
                  if (bathroomNum < 29) setBathroomNum(bathroomNum + 1);
                }}
              />
            </View>
          </View>
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
          isExpanded={expanded.includes(3)}
          onPress={() => {
            if (expanded.includes(3)) {
              setExpanded(expanded.filter((item) => item !== 3));
            } else {
              setExpanded([3]);
            }
          }}
        >
          <Text style={styles.title}>
            Tell guests what your place has to offer{" "}
          </Text>
          <ButtonGroup
            buttons={deviceTypeList}
            selectMultiple
            selectedIndexes={deviceType}
            vertical
            onPress={(value) => {
              setDeviceType(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>Do you have any standout amenities? </Text>
          <ButtonGroup
            buttons={standoutTypeList}
            selectMultiple
            selectedIndexes={standoutType}
            vertical
            onPress={(value) => {
              setStandoutType(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>
            Do you have any of these safety items?{" "}
          </Text>
          <ButtonGroup
            buttons={safetyDeviceTypeList}
            selectMultiple
            selectedIndexes={safetyDeviceType}
            vertical
            onPress={(value) => {
              setSafetyDeviceType(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
          <Text style={styles.title}>Acceptable guests? </Text>
          <ButtonGroup
            buttons={["Couple", "Male", "Female", "Family", "All"]}
            selectMultiple
            selectedIndexes={guestType}
            vertical
            onPress={(value) => {
              setGuestType(value);
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            containerStyle={styles.houseTypeContainer}
            textStyle={{ fontSize: 13 }}
          />
        </ListItem.Accordion>
      </View>
      <View style={styles.contentWrapper}>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title>Available Date</ListItem.Title>
              </ListItem.Content>
            </>
          }
          containerStyle={{ borderRadius: 15 }}
          isExpanded={expanded.includes(4)}
          onPress={() => {
            if (expanded.includes(4)) {
              setExpanded(expanded.filter((item) => item !== 4));
            } else {
              setExpanded([4]);
            }
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text style={styles.text}>Start Day</Text>

              <Text style={{ fontSize: 16 }}>
                {selectedDates && selectedDates.length !== 0
                  ? selectedDates[0]
                  : today}
              </Text>
            </View>

            <View
              style={{
                justifyContent: "center",
              }}
            >
              {/* 计算共几天 */}
              <Text style={{ fontSize: 14 }}>
                {nightStayCount >= 0 ? nightStayCount : 0} nights
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text style={styles.text}>End Day</Text>
              <Text style={{ fontSize: 16 }}>
                {selectedDates && selectedDates.length !== 0 ? (
                  selectedDates[selectedDates.length - 1]
                ) : (
                  <Text style={{ fontSize: 16 }}>{today}</Text>
                )}
              </Text>
            </View>
          </View>
          <CalendarList
            minDate={today}
            horizontal
            pastScrollRange={0}
            futureScrollRange={12}
            scrollEnabled
            markingType="period"
            markedDates={{
              ...selectedDates?.reduce((result, date, index) => {
                result[date] = {
                  selected: true,
                  color: "#2f95dc",
                  ...(index === 0 && { startingDay: true }),
                  ...(index === selectedDates.length - 1 && {
                    endingDay: true,
                  }),
                };
                return result;
              }, {}),
            }}
            onDayPress={(day) => toggleStartingEndingDays(day)}
          />
        </ListItem.Accordion>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Button
          title="Publish"
          size="lg"
          radius="sm"
          type="solid"
          containerStyle={{
            width: 150,
            alignSelf: "center",
          }}
          disabled={!formComplete}
          onPress={handleSubmit(publishHandler)}
        />
      </View>
      <Dialog
        isVisible={showSaveDraftDialog}
        onBackdropPress={() => setShowSaveDraftDialog(false)}
        overlayStyle={{ borderRadius: 10 }}
      >
        <Text>Do you want to save the draft before exiting?</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <Dialog.Button
            title="Delete"
            titleStyle={{ color: "red" }}
            onPress={handleDelete}
          />
          <Dialog.Button
            title="Save"
            onPress={() => {
              // Handle saving the draft here
              // For example, you can call a saveDraft function
              saveHandler();
              setShowSaveDraftDialog(false);
              router.back();
            }}
          />
        </View>
      </Dialog>
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
    width: "47%",
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
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    paddingLeft: 10,
    marginTop: -10,
  },
  text: {
    fontSize: 12,
  },
});

export default CreateListingScreen;
