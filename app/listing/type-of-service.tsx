import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView, TouchableOpacity } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { router, Stack } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation Mutation($updateListingId: String!, $serviceType: String) {
    updateListing(id: $updateListingId, serviceType: $serviceType) {
      id
    }
  }
`;

function TypeOfServiceScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction] = useMutation(updateListingMutation);

  const nextHandler = async () => {
    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        serviceType: listingData.serviceType,
      },
    });
    router.navigate("/listing/type-of-place");
  };

  const backHandler = async () => {
    router.back();
  };

  const typeOfService = [
    {
      name: "Rent",
      value: "rent",
      icon: <Ionicons name="key-outline" size={30} color={colors.text} />,
    },

    {
      name: "Travel",
      value: "travel",
      icon: <Fontisto name="holiday-village" size={30} color={colors.text} />,
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
          justifyContent: "flex-start",
          padding: 20,
          flex: 0.35,
        }}
      >
        <Text style={styles.title}>
          Which type of services are you looking to offer?
        </Text>

        <FlashList
          showsVerticalScrollIndicator={false}
          estimatedItemSize={100}
          data={typeOfService}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const newServiceType = item.value;
                dispatchListingData({
                  ...listingData,
                  serviceType: newServiceType,
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
                    listingData.serviceType === item.value
                      ? "#888"
                      : colors.border1,
                  height: 85,
                  backgroundColor:
                    listingData.serviceType === item.value
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

        {listingData.serviceType === "rent" && (
          <Text style={[styles.subtitle, { color: colors.textSub1 }]}>
            Weekly rent with an option for daily payment. Suited for long-term
            and short-term tenants.
          </Text>
        )}

        {listingData.serviceType === "travel" && (
          <Text style={[styles.subtitle, { color: colors.textSub1 }]}>
            Strictly daily payment. Ideal for short-term travelers.
          </Text>
        )}
      </View>

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
            disabled={!listingData.serviceType}
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
    fontSize: 15,
  },
});

export default TypeOfServiceScreen;
