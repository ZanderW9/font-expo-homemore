import { GlobalContext } from "@app/_layout";
import NotLogIn from "@components/NotLogIn";
import { View } from "@components/Themed";
import CreateModal from "@components/wishlist/CreateModal";
import FavoriteCardContainer from "@components/wishlist/FavoriteCardsContainer";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useRef, useContext } from "react";

function TabWishlistScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);

  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <View style={{ backgroundColor: "#f5f5f5", flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Wishlist",
          headerTitleAlign: "center",
          headerRight: () => (
            <Ionicons
              name="md-add-outline"
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
        <FavoriteCardContainer />
      ) : (
        <NotLogIn
          title="Sign in and view your wishlist"
          subtitle="You can create, view, and edit your wishlist after signing in"
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
