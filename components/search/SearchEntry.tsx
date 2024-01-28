import { SafeAreaView } from "@components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "@rneui/themed";
import { router } from "expo-router";
import { StyleSheet, Pressable } from "react-native";

const SearchEntry = (props: { text: string }) => {
  const { text } = props;
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Pressable
        style={styles.searchContainer}
        onPress={() => router.push("/search")}
      >
        <Button
          type="clear"
          onPress={() => router.push("/search")}
          icon={<Ionicons name="search" size={22} color="gray" />}
          containerStyle={{ marginRight: 3 }}
        />
        <Text style={{ color: "gray", fontSize: 18, flex: 1 }}>
          {text || "Explore home from here~"}
        </Text>
        <Button
          type="clear"
          onPress={() => router.push("/search")}
          icon={<Ionicons name="options-outline" size={24} color="gray" />}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default SearchEntry;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10,
    width: "100%",
    paddingBottom: 5,
  },
  searchContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 6,
    width: "100%",
    paddingTop: 4,
  },
});
