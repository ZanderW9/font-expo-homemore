import { SpeedDial } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1e88e5",
  },
});

function AddListingButton() {
  const [open, setOpen] = React.useState(false);

  const createHandler = async () => {
    router.push("/create");
    setOpen(false);
  };

  const deleteHandler = async () => {
    setOpen(false);
  };

  return (
    <SpeedDial
      buttonStyle={styles.button}
      isOpen={open}
      icon={{ name: "edit", color: "#fff" }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        buttonStyle={styles.button}
        icon={{ name: "add", color: "#fff" }}
        // title="Add"
        onPress={createHandler}
      />
      <SpeedDial.Action
        buttonStyle={styles.button}
        icon={{ name: "delete", color: "#fff" }}
        // title="Delete"
        onPress={deleteHandler}
      />
    </SpeedDial>
  );
}

export default AddListingButton;
