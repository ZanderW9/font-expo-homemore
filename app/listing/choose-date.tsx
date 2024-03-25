import { gql, useMutation } from "@apollo/client";
import { View, Text, SafeAreaView } from "@components/Themed";
import { useCreateListingContext } from "@components/listing/create/CreateProvider";
import MyStepIndicator from "@components/listing/create/MyStepIndicator";
import { useThemedColors } from "@constants/theme";
import { CommonActions } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { format, startOfDay, addDays, differenceInDays } from "date-fns";
import { router, Stack, useNavigation } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { CalendarList } from "react-native-calendars";

const updateListingMutation = gql`
  mutation Mutation(
    $updateListingId: String!
    $availability: [String]
    $published: Boolean
  ) {
    updateListing(
      id: $updateListingId
      availability: $availability
      published: $published
    ) {
      id
    }
  }
`;

function ChooseDate() {
  const colors = useThemedColors();
  const { listingData } = useCreateListingContext();
  // this is a ugly and disgusting question, it should be fixed in the future
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDates, setSelectedDates] = useState([]);
  const [nightStayCount, setNightStayCount] = useState(0);

  const [updateListingFunction, { loading }] = useMutation(
    updateListingMutation,
  );

  const toggleStartingEndingDays = (day) => {
    const today = startOfDay(new Date()); // 今天的开始时间
    const selectedDateObjs = selectedDates.map((dateString) =>
      startOfDay(new Date(dateString)),
    );
    const dayDateObj = startOfDay(new Date(day.dateString));

    if (dayDateObj < today) {
      // 今天之前的日期不进行处理
      return;
    }

    if (
      selectedDateObjs.length === 1 &&
      selectedDateObjs[0].getTime() === dayDateObj.getTime()
    ) {
      // 点击同一天两次，该天既是startingDay也是endingDay
      setSelectedDates([format(dayDateObj, "yyyy-MM-dd")]);
      setNightStayCount(0);
    } else if (selectedDateObjs.length === 0 || selectedDateObjs.length > 1) {
      setSelectedDates([format(dayDateObj, "yyyy-MM-dd")]);
      setNightStayCount(0);
    } else if (selectedDateObjs.length === 1) {
      const firstSelectedDate = selectedDateObjs[0];
      const secondSelectedDate = dayDateObj;

      if (firstSelectedDate > secondSelectedDate) {
        setSelectedDates([format(dayDateObj, "yyyy-MM-dd")]);
        setNightStayCount(0);
      } else {
        const datesBetweenCount = differenceInDays(
          secondSelectedDate,
          firstSelectedDate,
        );
        const datesBetween = Array.from(
          { length: datesBetweenCount - 1 },
          (_, index) =>
            format(addDays(firstSelectedDate, index + 1), "yyyy-MM-dd"),
        );
        setSelectedDates([
          format(firstSelectedDate, "yyyy-MM-dd"),
          ...datesBetween,
          format(secondSelectedDate, "yyyy-MM-dd"),
        ]);
        setNightStayCount(datesBetweenCount);
      }
    }
  };

  const nextHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        availability: selectedDates,
      },
    });
    router.navigate("/listing/step-3");
  };

  const backHandler = async () => {
    router.back();
  };

  const navigation = useNavigation();
  const handleResetAction = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{ name: "save-success" }],
      }),
    );
  };

  const saveAndExitHandler = async () => {
    await updateListingFunction({
      variables: {
        updateListingId: listingData.listingId,
        serviceType: listingData.serviceType,
        published: false,
      },
    });
    handleResetAction();
  };

  return (
    <View style={styles.container}>
      <Button
        title=" Save & Exit"
        type="clear"
        onPress={saveAndExitHandler}
        buttonStyle={{
          justifyContent: "flex-start",
          marginTop: 40,
          marginHorizontal: 10,
        }}
        titleStyle={{
          color: "rgb(236, 76, 96)",
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
          justifyContent: "flex-start",
          flex: 0.7,
        }}
      >
        <View style={{ padding: 20 }}>
          <Text style={styles.title}>
            Choose your Check-in and Check-out date
          </Text>
          <Text style={styles.subtitle}>
            Guests can only book within these dates
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text style={styles.text}>Start Day</Text>

            <Text style={{ fontSize: 16 }}>
              {selectedDates && selectedDates.length !== 0
                ? selectedDates[0]
                : today}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
            }}
          >
            {/* 计算共几天 */}
            <Text style={{ fontSize: 14 }}>
              {nightStayCount >= 0 ? nightStayCount : 0} nights
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text style={styles.text}>End Day</Text>
            <Text style={{ fontSize: 16 }}>
              {selectedDates && selectedDates.length !== 0 ? (
                selectedDates[selectedDates.length - 1]
              ) : (
                <Text style={{ fontSize: 16 }}>{today}</Text>
              )}
            </Text>
          </View>
        </View>
        <CalendarList
          minDate={today}
          calendarStyle={{
            backgroundColor: colors.back1,
          }}
          style={{
            backgroundColor: colors.back1,
          }}
          theme={{
            backgroundColor: colors.back1,
            calendarBackground: colors.back1,
            textSectionTitleColor: colors.text,
            selectedDayBackgroundColor: colors.mainColor,
            selectedDayTextColor: colors.text,
            monthTextColor: colors.text,
            dayTextColor: colors.text,
          }}
          pastScrollRange={0}
          futureScrollRange={24}
          scrollEnabled
          markingType="period"
          markedDates={{
            ...selectedDates?.reduce((result, date, index) => {
              result[date] = {
                selected: true,
                color: "rgb(236, 76, 96)",
                ...(index === 0 && { startingDay: true }),
                ...(index === selectedDates.length - 1 && {
                  endingDay: true,
                }),
              };
              return result;
            }, {}),
          }}
          onDayPress={(day) => toggleStartingEndingDays(day)}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        {/* 进度条 */}
        <MyStepIndicator currentPosition={5} stepCount={6} />
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
              borderColor: "rgb(236, 76, 96)",
              height: 50,
              width: 100,
              borderRadius: 7,
              marginVertical: 20,
            }}
            titleStyle={{
              color: "rgb(236, 76, 96)",
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
          <Button
            title={
              loading ? (
                <ActivityIndicator color={colors.textReverse} size="small" />
              ) : (
                "Next"
              )
            }
            onPress={nextHandler}
            disabled={selectedDates.length === 0}
            buttonStyle={{
              backgroundColor: "rgb(236, 76, 96)",
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
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -10,
  },
  text: {
    fontSize: 12,
  },
});

export default ChooseDate;
