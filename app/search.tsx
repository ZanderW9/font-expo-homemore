import { SafeAreaView } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons
        name="close-circle-outline"
        size={24}
        color="gray"
        style={{ marginRight: 10 }}
        onPress={() => router.back()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
