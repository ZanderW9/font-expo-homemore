import { View } from "@components/Themed";
import CreateModal from "@components/wishlist/CreateModal";
import FavoriteCardContainer from "@components/wishlist/FavoriteCardsContainer";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useRef } from "react";

function TabWishlistScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef(null);

  return (
    <View>
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
                bottomSheetModalRef.current?.present();
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 100);
              }}
            />
          ),
        }}
      />
      <FavoriteCardContainer />
      <CreateModal
        bottomSheetModalRef={bottomSheetModalRef}
        inputRef={inputRef}
      />
    </View>
  );
}

export default TabWishlistScreen;
