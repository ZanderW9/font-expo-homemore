import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView, TouchableOpacity } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router, Stack } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation Mutation($updateListingId: String!, $orderType: String) {
    updateListing(id: $updateListingId, orderType: $orderType) {
      id
    }
  }
`;

function TypeOfOrderScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);
  const nextHandler = async () => {
    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        orderType: listingData.orderType,
      },
    });
    router.navigate("/listing/price");
  };

  const backHandler = async () => {
    router.back();
  };

  const typeOfOrder = [
    {
      name: "Approve or decline requests",
      value: "approveOrDecline",
      icon: (
        <Ionicons name="chatbubble-outline" size={30} color={colors.text} />
      ),
      description: "Guests must ask if they can book",
    },

    {
      name: "Instantly book without approval",
      value: "instantBook",
      icon: (
        <MaterialCommunityIcons
          name="lightning-bolt-outline"
          size={30}
          color={colors.text}
        />
      ),
      description: "Guests can book automatically",
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
        <Text style={styles.title}>Decide how you'll confirm reservations</Text>

        <FlashList
          estimatedItemSize={100}
          data={typeOfOrder}
          numColumns={1}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const newOrderType = item.value;
                dispatchListingData({
                  ...listingData,
                  orderType: newOrderType,
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
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: 80,
                  width: "100%",
                  maxWidth: 400,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderColor:
                    listingData.orderType === item.value
                      ? "#888"
                      : colors.border1,
                  backgroundColor:
                    listingData.orderType === item.value
                      ? colors.back2
                      : colors.back1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                  }}
                >
                  <View
                    style={{
                      margin: 5,
                      justifyContent: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text style={styles.subtitle}>{item.name}</Text>
                  </View>
                  <View
                    style={{
                      margin: 5,
                      justifyContent: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    backgroundColor: "transparent",
                  }}
                >
                  {item.icon}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={0} stepCount={3} />
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
            disabled={!listingData.orderType}
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
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    color: "gray",
  },
});

export default TypeOfOrderScreen;
