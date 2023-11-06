import { gql, useMutation } from "@apollo/client";
import useCachedQuery from "@config/useCachedQuery";
import { ListItem, Button } from "@rneui/themed";
import { usePathname, router } from "expo-router";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";

const favoriteByUserQuery = gql`
  # Increments a back-end counter and gets its resulting value
  query MyFavorites {
    myFavorites {
      id
      name
      private
      listings {
        listing {
          id
        }
      }
    }
  }
`;

const deleteFavoriteMutation = gql`
  mutation DeleteFavorite($favoriteId: String!) {
    deleteFavorite(favoriteId: $favoriteId)
  }
`;

const FavoriteCardsContainer: React.FunctionComponent = () => {
  const { data } = useCachedQuery(favoriteByUserQuery, usePathname(), {});
  const [expanded, setExpanded] = React.useState(true);
  const [deleteFavoriteFunction] = useMutation(deleteFavoriteMutation, {
    errorPolicy: "all",
  });

  const deleteFavoriteHandler = (favoriteId: string) => () => {
    deleteFavoriteFunction({
      variables: { favoriteId },
      refetchQueries: [
        {
          query: favoriteByUserQuery,
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ListItem.Accordion
          content={
            <>
              <ListItem.Content>
                <ListItem.Title style={{ fontSize: 18, fontWeight: "700" }}>
                  My Wishlists · {data && data.myFavorites.length}
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={expanded}
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          {data &&
            data.myFavorites &&
            data.myFavorites.map((item, index) => (
              <ListItem.Swipeable
                style={styles.card}
                key={index}
                leftContent={(reset) => (
                  <Button
                    title="Delete"
                    onPress={deleteFavoriteHandler(item.id)}
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                  />
                )}
                rightContent={(reset) => (
                  <Button
                    title="share"
                    onPress={() => reset()}
                    icon={{ name: "share", color: "white" }}
                    buttonStyle={{ minHeight: "100%" }}
                  />
                )}
                onPress={() => {
                  router.push({
                    pathname: `/wishlist/${item.name}`,
                    params: { favoriteId: item.id },
                  });
                }}
              >
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    {item.listings ? item.listings.length : 0} Items
                    {" · "}
                    {item.private ? "Private" : "Public"}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem.Swipeable>
            ))}
        </ListItem.Accordion>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  card: {
    width: "100%",
    fontSize: 30,
  },
});
export default FavoriteCardsContainer;
