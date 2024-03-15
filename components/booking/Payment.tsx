import { Text, View } from "@components/Themed";
import { useThemedColors } from "@constants/theme";
import { CheckBox } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

function Payment(props: any) {
  const colors = useThemedColors();
  const [checked, setChecked] = useState(true);
  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          borderWidth: 1,
          borderColor: colors.border1,
          padding: 10,
          borderRadius: 15,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>Choose payment method</Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={styles.subtitle}>Face to face</Text>
            <CheckBox
              checked={checked}
              onPress={() => setChecked(!checked)}
              checkedColor="rgb(236, 76, 96)"
              iconType="material-community"
              checkedIcon="radiobox-marked"
              uncheckedIcon="radiobox-blank"
              containerStyle={{
                margin: 0,
                padding: 0,
                backgroundColor: "transparent",
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 16,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 14,
  },
});

export default Payment;
