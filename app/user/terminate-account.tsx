import { gql, useMutation, useApolloClient } from "@apollo/client";
import { createApolloLink } from "@components/ApolloClient";
import { View, Text, SafeAreaView } from "@components/Themed";
import { updateAppMeta } from "@config/state/appMetaSlice";
import { useDispatch } from "@config/state/store";
import { clearLocalItems } from "@config/storageManager";
import { useThemedColors } from "@constants/theme";
import { Button, Dialog } from "@rneui/themed";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

const deleteAccountMutation = gql`
  mutation Mutation {
    DeleteUser {
      id
    }
  }
`;

export default function Screen() {
  const colors = useThemedColors();
  const client = useApolloClient();
  const dispatch = useDispatch();

  const [showSaveDraftDialog, setShowSaveDraftDialog] = useState(false);

  const [deleteAccountFunction] = useMutation(deleteAccountMutation);

  const deleteAccountHandler = async () => {
    await deleteAccountFunction();
    await clearLocalItems();

    client.setLink(createApolloLink(null));
    client.resetStore();
    dispatch(updateAppMeta({ user: null, token: null }));
    router.replace("/profile");
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
      theme={{ background: "back2" }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen
          options={{
            title: "Terminate Account",
            headerTitleAlign: "center",
            headerBackTitleVisible: false,
            animation: "slide_from_right",
            headerStyle: {
              backgroundColor: colors.back1,
            },
            headerTitleStyle: {
              color: colors.text,
            },
          }}
        />
        <View style={styles.content} theme={{ background: "back2" }}>
          <Text style={styles.title}>
            Account Termination Policy and Procedure
          </Text>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            Account Termination
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            We understand that users may need to terminate their accounts for
            various reasons and have provided you with the option to do so.
            Please note that account termination is an irreversible process and
            will result in the permanent deletion of your account data and
            related information. Before submitting a termination request, please
            ensure that you have read and understood the following information.
          </Text>

          <Text style={[styles.subTitle, { color: colors.text }]}>
            Termination Procedure
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            If you decide to terminate your account, please follow these steps:
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            1. Log in to your account.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            2. Navigate to the "Account and Security" page.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            3. Locate and select the "Terminate Account" option.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            4. Provide the necessary information to verify your identity.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            5. Confirm your termination request.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            Once your termination request is confirmed, your account will be
            terminated, and all related data will be permanently deleted. Please
            be aware that this process is irreversible.
          </Text>

          <Text style={[styles.subTitle, { color: colors.text }]}>
            Data Deletion
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            Account termination will result in the permanent deletion of all
            personal data associated with your account. This includes but is not
            limited to personal information, account settings, and history.
          </Text>

          <Text style={[styles.subTitle, { color: colors.text }]}>
            Important Notes
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            1. After terminating your account, you will lose access to it and
            cannot log in or retrieve account information.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            2. Please ensure to back up any crucial information you wish to
            retain before terminating your account.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            3. Terminating one account does not affect any other accounts
            associated with our services.
          </Text>

          <Text style={[styles.subTitle, { color: colors.text }]}>
            Contact Us
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            If you encounter any issues or have questions during the account
            termination process, please contact our customer support team, and
            we will be happy to assist you in completing the termination
            procedure.
          </Text>
          <Text style={[styles.text, { color: colors.textSub1 }]}>
            We appreciate your use of our services and hope to have the
            opportunity to serve you better in the future.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
            theme={{ background: "back2" }}
          >
            <Button
              title="Accept"
              onPress={() => {
                setShowSaveDraftDialog(true);
              }}
              buttonStyle={{
                backgroundColor: "rgb(236, 76, 96)",
                height: 50,
                width: 100,
                borderRadius: 7,
                marginVertical: 40,
              }}
            />
            <Button
              title="Cancel"
              type="outline"
              onPress={() => {
                router.back();
              }}
              buttonStyle={{
                borderColor: "rgb(236, 76, 96)",
                height: 50,
                width: 100,
                borderRadius: 7,
                marginVertical: 40,
              }}
              titleStyle={{
                color: "rgb(236, 76, 96)",
                alignSelf: "center",
                justifyContent: "center",
              }}
            />
          </View>
        </View>

        <Dialog
          isVisible={showSaveDraftDialog}
          onBackdropPress={() => setShowSaveDraftDialog(false)}
          overlayStyle={{
            borderRadius: 10,
            backgroundColor: colors.back1,
          }}
        >
          <Text>Are you sure you want to terminate your account?</Text>
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
              onPress={deleteAccountHandler}
            />
            <Dialog.Button
              title="Cancel"
              onPress={() => {
                setShowSaveDraftDialog(false);
              }}
            />
          </View>
        </Dialog>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 13,
  },
  title: {
    fontSize: 16,
    alignSelf: "center",
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 14,
    marginVertical: 5,
  },
  text: {
    fontSize: 12,
  },
});
