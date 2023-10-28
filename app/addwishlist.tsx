import { gql, useQuery } from "@apollo/client";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

function AddwishlistScreen() {
  const { listing } = useLocalSearchParams();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is addwishlist page for {listing}</Text>
    </View>
  );
}

export default AddwishlistScreen;
