import { gql } from "@apollo/client";
import { usePathname } from "expo-router";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

import useCachedQuery from "./useCachedQuery";
import { Text } from "../components/Themed";

const favoriteByUserQuery = gql`
  # Increments a back-end counter and gets its resulting value
  query Query {
    myFavorites {
      name
    }
  }
`;

const FavoriteCardsContainer: React.FunctionComponent = () => {
  const { data, loading } = useCachedQuery(favoriteByUserQuery, usePathname());
  if (!loading && data) {
    console.log("data: ", data);
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          {data &&
            data.myFavorites.map((item, index) => (
              <View key={index} style={styles.card}>
                <Text> {item.name}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  card: {
    width: "50%",
  },
});
export default FavoriteCardsContainer;
