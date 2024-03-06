import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import { Button, Input, CheckBox } from "@rneui/themed";
import { router, Stack, useNavigation } from "expo-router";
import { StyleSheet } from "react-native";

const updateListingMutation = gql`
  mutation Mutation(
    $updateListingId: String!
    $discount: [Json]
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      discount: $discount
      published: $published
    ) {
      id
    }
  }
`;

function DiscountScreen() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const navigation = useNavigation();

  const handleResetAction = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: "post-success" }],
      }),
    );
  };

  const [updateListingFunction] = useMutation(updateListingMutation);

  const nextHandler = async () => {
    updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        discount: listingData.discount,
        published: true,
      },
    });
    handleResetAction();
  };

  const backHandler = async () => {
    router.back();
  };

  const discountType = [
    {
      label: "Weekly discount",
      discountType: "week",
      discountValue: "10",
      description: "For stays of 7 nights or more",
    },
    {
      label: "Monthly discount",
      discountType: "month",
      discountValue: "20",
      description: "For stays of 28 nights or more",
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
          flex: 0.8,
        }}
      >
        <Text style={styles.title}>Add discount</Text>
        <Text style={styles.subtitle}>
          Offer a discount to guests who stay for a week or a month
        </Text>

        {discountType.map((item, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 20,
            }}
          >
            <Input
              placeholder="0"
              placeholderTextColor={colors.text}
              value={
                listingData.discount?.find(
                  (discount) => discount.discountType === item.discountType,
                )?.discountValue
              }
              onChangeText={(text) => {
                const numericInput = text.trim() === "" ? "0" : text;
                const numericValue = parseInt(numericInput, 10);
                const clampedValue = Math.min(Math.max(numericValue, 0), 100);
                dispatchListingData({
                  ...listingData,
                  discount: listingData.discount?.map((discount) =>
                    discount.discountType === item.discountType
                      ? { ...discount, discountValue: String(clampedValue) }
                      : discount,
                  ),
                });
              }}
              disabled={
                !listingData.discount?.some(
                  (discount) => discount.discountType === item.discountType,
                )
              }
              rightIcon={
                <FontAwesome5 name="percent" size={10} color={colors.text} />
              }
              keyboardType="numeric"
              returnKeyType="done"
              containerStyle={styles.inputWrapper}
              inputContainerStyle={[
                styles.inputContainer,
                { borderColor: colors.border1 },
              ]}
              inputStyle={{
                color: colors.text,
              }}
            />
            <View style={{ width: "65%" }}>
              <Text style={[styles.description, { color: colors.text }]}>
                {item.label}
              </Text>
              <Text style={[styles.subDescription, { color: colors.text }]}>
                {item.description}
              </Text>
            </View>
            <CheckBox
              checked={listingData.discount?.some(
                (discount) => discount.discountType === item.discountType,
              )}
              checkedColor="rgb(236, 76, 96)"
              onPress={() => {
                dispatchListingData({
                  ...listingData,
                  discount: listingData.discount?.some(
                    (discount) => discount.discountType === item.discountType,
                  )
                    ? listingData.discount?.filter(
                        (discount) =>
                          discount.discountType !== item.discountType,
                      )
                    : [
                        ...listingData.discount,
                        {
                          discountType: item.discountType,
                          discountValue: item.discountValue,
                        },
                      ],
                });
              }}
              containerStyle={{
                backgroundColor: "transparent",
                borderColor: "transparent",
                width: "10%",
              }}
            />
          </View>
        ))}
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <MyStepIndicator currentPosition={2} stepCount={3} />
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
            title="Post"
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
    fontSize: 20,
  },
  description: {
    fontSize: 16,
  },
  subDescription: {
    fontSize: 14,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  inputWrapper: {
    width: "20%",
    paddingTop: 20,
  },
});

export default DiscountScreen;
