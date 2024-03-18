import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Button, Input } from "@rneui/themed";
import { router, Stack, useNavigation } from "expo-router";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";

const updateListingMutation = gql`
  mutation Mutation(
    $updateListingId: String!
    $price: Int
    $published: Boolean
  ) {
    updateListing(id: $updateListingId, price: $price, published: $published) {
      id
    }
  }
`;
function PriceScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction, { loading }] = useMutation(
    updateListingMutation,
  );
  const nextHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        price: parseInt(listingData.price),
      },
    });
    router.navigate("/listing/discount");
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
          <Text style={styles.title}>Now , let's set your price</Text>
          <Text style={styles.subtitle}>
            This is the price per night for your place, you can edit this later.
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Input
                autoFocus
                placeholder="0"
                containerStyle={styles.inputWrapper}
                inputContainerStyle={styles.inputContainer}
                inputStyle={{
                  fontSize: 50,
                  alignContent: "center",
                  justifyContent: "center",
                  color: colors.text,
                }}
                leftIcon={
                  <FontAwesome
                    name="dollar"
                    size={40}
                    color={colors.text}
                    style={{ marginRight: 10 }}
                  />
                }
                keyboardType="numeric"
                returnKeyType="done"
                value={listingData.price}
                onChangeText={(text) =>
                  dispatchListingData({ ...listingData, price: text })
                }
              />
            </View>
          </View>
        </View>

        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <MyStepIndicator currentPosition={1} stepCount={3} />
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
              title={
                loading ? (
                  <ActivityIndicator color={colors.textReverse} size="small" />
                ) : (
                  "Next"
                )
              }
              onPress={nextHandler}
              disabled={!listingData.price}
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
    </TouchableWithoutFeedback>
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
  inputContainer: {
    borderBottomWidth: 0,
  },
  inputWrapper: {},
});

export default PriceScreen;
