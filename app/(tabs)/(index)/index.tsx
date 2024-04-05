import ListingCardsContainer from "@components/ListingCardsContainer";
import { View } from "@components/Themed";
import SearchEntry from "@components/search/SearchEntry";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

function TabExploreScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <SearchEntry text="" />
      <ListingCardsContainer />
      <FAB
        size="small"
        title={t("explore.map_button")}
        placement="center"
        icon={
          <Ionicons
            name="map-outline"
            size={24}
            color="white"
            style={{ paddingLeft: 7 }}
          />
        }
        onPress={() =>
          router.navigate({ pathname: "/map", params: { center: {} } })
        }
        color="rgba(0,0,0,0.4)"
      />
    </View>
  );
}

export default TabExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
