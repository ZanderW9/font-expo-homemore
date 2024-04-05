import { gql, useQuery } from "@apollo/client";
import NotLogIn from "@components/NotLogIn";
import { View } from "@components/Themed";
import CreateModal from "@components/wishlist/CreateModal";
import FavoriteCardContainer from "@components/wishlist/FavoriteCardsContainer";
import { useThemedColors } from "@constants/theme";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useRef } from "react";

import { RootState, useSelector } from "@/config/state/store";

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
  const colors = useThemedColors();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);
  const { data } = useQuery(favoriteByUserQuery);

  const { token } = useSelector((state: RootState) => state.appMeta);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: !!token,
          title: "Wishlist",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: colors.text,
          },
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerRight: () => (
            <Ionicons
              name="add-outline"
              size={30}
              color="gray"
              onPress={() => {
                if (token) {
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
      {token ? (
        <View
          style={{
            flex: 1,
          }}
          theme={{ background: "back2" }}
        >
          <FavoriteCardContainer data={data?.myFavorites} />

          <CreateModal
            bottomSheetModalRef={bottomSheetModalRef}
            inputRef={inputRef}
          />
        </View>
      ) : (
        <NotLogIn
          icon={
            <AntDesign
              name="hearto"
              size={40}
              color="#ec4c60"
              style={{
                marginVertical: 20,
              }}
            />
          }
          title="wishlist.not_sign_in.title"
          description="wishlist.not_sign_in.description"
        />
      )}
    </View>
  );
}

export default TabWishlistScreen;
