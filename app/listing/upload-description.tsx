import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { CommonActions } from "@react-navigation/native";
import { Button, Input } from "@rneui/themed";
import { router, Stack, useNavigation } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";

const updateListingMutation = gql`
  mutation Mutation(
    $updateListingId: String!
    $description: String
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      description: $description
      published: $published
    ) {
      id
    }
  }
`;

function UploadDescription() {
  const colors = useThemedColors();
  const { listingData, dispatchListingData } = useCreateListingContext();

  const [updateListingFunction, { loading }] = useMutation(
    updateListingMutation,
  );

  const nextHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        description: listingData.description,
      },
    });
    router.navigate("/listing/choose-date");
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
          <Text style={styles.title}>Create your description</Text>
          <Text style={styles.subtitle}>
            Tell guests about your place. You can highlight what you love about
          </Text>

          <Input
            containerStyle={styles.inputWrapper}
            inputContainerStyle={[
              styles.inputContainer,
              { borderColor: colors.border1 },
            ]}
            inputStyle={{
              height: 100,
              alignContent: "flex-start",
              justifyContent: "flex-start",
              color: colors.text,
            }}
            returnKeyType="done"
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Enter") {
                Keyboard.dismiss();
              }
            }}
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            value={listingData.description}
            onChangeText={(text) => {
              dispatchListingData({ ...listingData, description: text });
            }}
          />
        </View>

        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          {/* 进度条 */}
          <MyStepIndicator currentPosition={4} stepCount={6} />
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
              disabled={listingData?.description === ""}
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
    fontSize: 16,
    paddingBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -10,
  },
});

export default UploadDescription;
