import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, SafeAreaView, Pressable } from "react-native";

import { Text, View } from "../components/Themed";

function AddwishlistScreen() {
  const { listing } = useLocalSearchParams();
  console.log(listing);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    safeContainer: {
      backgroundColor: "white",
      width: "100%",
      height: "50%",
      flexDirection: "column",
      alignItems: "center",
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
      <Pressable
        style={{ flex: 1, width: "100%" }}
        onPress={() => router.back()}
      >
        <Text />
      </Pressable>
      <View
        style={{
          height: 50,
          borderBottomColor: "rgba(230, 230, 230, 1)",
          borderBottomWidth: 0.5,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="close"
          size={24}
          color="gray"
          style={{ padding: 10 }}
          onPress={() => router.back()}
        />
      </View>
      <SafeAreaView style={styles.safeContainer}>
        <View style={{ flex: 1 }} />
        <Button
          title="Create wishlist folder"
          size="lg"
          radius="sm"
          type="solid"
          containerStyle={{
            width: 250,
            alignSelf: "center",
          }}
        />
      </SafeAreaView>
    </View>
  );
}

export default AddwishlistScreen;
