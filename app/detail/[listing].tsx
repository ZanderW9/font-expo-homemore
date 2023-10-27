import { gql, useQuery } from "@apollo/client";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";

function detailScreen() {
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
      <Stack.Screen options={{ title: listing }} />
      <Text style={styles.title}>This is detail page for {listing}</Text>
    </View>
  );
}

export default detailScreen;
