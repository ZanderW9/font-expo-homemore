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
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router, Stack } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation Mutation($updateListingId: String!, $guestType: [String]) {
    updateListing(id: $updateListingId, guestType: $guestType) {
      id
    }
  }
`;

function TypeOfGuestScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);
  const nextHandler = async () => {
    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        guestType: listingData.guestType,
      },
    });
    router.navigate("/listing/upload-images");
  };

  const backHandler = async () => {
    router.back();
  };

  const guest = [
    {
      name: "Family",
      value: "family",
      icon: (
        <MaterialIcons name="family-restroom" size={26} color={colors.text} />
      ),
    },

    {
      name: "Couple",
      value: "couple",
      icon: (
        <FontAwesome6 name="people-pulling" size={30} color={colors.text} />
      ),
    },
    {
      name: "Male",
      value: "male",
      icon: <Ionicons name="male" size={26} color={colors.text} />,
    },
    {
      name: "Female",
      value: "female",
      icon: <Ionicons name="female" size={30} color={colors.text} />,
    },
    {
      name: "Non-Smoker",
      value: "nonSmoker",
      icon: <MaterialIcons name="smoke-free" size={30} color={colors.text} />,
    },
    {
      name: "With pet",
      value: "pet",
      icon: <FontAwesome5 name="dog" size={26} color={colors.text} />,
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
      <ScrollView style={{ padding: 20, minHeight: 10, minWidth: 10 }}>
        <Text style={styles.title}>Select your favorite guest type</Text>

        <View style={{ minHeight: 10, minWidth: 10 }}>
          <FlashList
            estimatedItemSize={100}
            data={guest}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  const newguestType = listingData.guestType?.includes(
                    item.value,
                  )
                    ? listingData.guestType?.filter(
                        (guestType) => guestType !== item.value,
                      )
                    : [...(listingData.guestType || []), item.value];
                  dispatchListingData({
                    ...listingData,
                    guestType: newguestType,
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
                    borderColor: listingData.guestType?.includes(item.value)
                      ? "#888"
                      : colors.border1,
                    height: 85,
                    backgroundColor: listingData.guestType?.includes(item.value)
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

export default TypeOfGuestScreen;
