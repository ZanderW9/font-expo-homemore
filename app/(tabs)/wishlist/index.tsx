import { gql, useQuery } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import NotLogIn from "@components/NotLogIn";
import { View } from "@components/Themed";
import CreateModal from "@components/wishlist/CreateModal";
import FavoriteCardContainer from "@components/wishlist/FavoriteCardsContainer";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useRef, useContext } from "react";

const favoriteByUserQuery = gql`
  query Query {
    myFavorites {
      id
      name
      description
      private
      owner {
        id
      }
      listings {
        listing {
          images {
            smallUrl
            thumbhash
          }
        }
      }
    }
  }
`;

function TabWishlistScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);
  const { data } = useQuery(favoriteByUserQuery);

  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <View
      style={{
        backgroundColor: "#f5f5f5",
        flex: 1,
        paddingTop: 4,
        paddingHorizontal: 4,
      }}
    >
      <Stack.Screen
        options={{
          title: "Wishlist",
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (isLoggedIn) {
                  bottomSheetModalRef.current?.present();
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }
              }}
            />
          ),
        }}
      />
      {isLoggedIn ? (
        <FavoriteCardContainer data={data?.myFavorites} />
      ) : (
        <NotLogIn
          title="Sign in and view your wishlist"
          subtitle="You can create, view, and edit your wishlist here"
        />
      )}
      <CreateModal
        bottomSheetModalRef={bottomSheetModalRef}
        inputRef={inputRef}
      />
    </View>
  );
}

export default TabWishlistScreen;
