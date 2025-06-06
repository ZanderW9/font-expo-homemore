import { View, Text, SafeAreaView } from "@components/Themed";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { Button } from "@rneui/themed";
import { router, Stack } from "expo-router";
import { StyleSheet } from "react-native";

function Step3() {
  const colors = useThemedColors();

  const nextHandler = async () => {
    router.navigate("/listing/confirm-order");
  };

  const backHandler = async () => {
    router.back();
  };

  const labels = ["Step 1", "Step 2", "Step 3"];

  return (
    <View style={styles.container}>
      <Button
        title=" Save & Exit"
        type="clear"
        onPress={backHandler}
        buttonStyle={{
          justifyContent: "flex-start",
          marginVertical: 40,
          marginHorizontal: 10,
        }}
        titleStyle={{
          color: colors.mainColor,
          alignSelf: "center",
          justifyContent: "center",
        }}
      />
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerShown: false,
        }}
      />
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 20,
          flex: 0.8,
        }}
      >
        <Text style={styles.subtitle}>Step 3</Text>
        <Text style={styles.title}>Finish up and publish</Text>
        <Text style={styles.subtitle}>
          Finally, you'll choose booking settings, set your price, and publish
          your listing.
        </Text>
      </View>

      {/* 进度条 */}
      <MyStepIndicator currentPosition={2} stepCount={3} labels={labels} />

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginHorizontal: 20,
            justifyContent: "space-between",
          }}
          theme={{ background: "back1" }}
        >
          <Button
            title="Back"
            type="outline"
            onPress={backHandler}
            buttonStyle={{
              borderColor: colors.mainColor,
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
            titleStyle={{
              color: colors.mainColor,
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
          <Button
            title="Next"
            onPress={nextHandler}
            buttonStyle={{
              backgroundColor: colors.mainColor,
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 0,
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    paddingBottom: 10,
  },
});

export default Step3;
