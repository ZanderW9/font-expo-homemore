import { Text, View } from "@components/Themed";
import { useBookingContext } from "@components/booking/BookingProvider";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Divider } from "@rneui/themed";
import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { CalendarList } from "react-native-calendars";

function CheckIn(props: any) {
  const colors = useThemedColors();
  const today = new Date().toISOString().slice(0, 10);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(today);
  const {
    nightStayCount,
    setNightStayCount,
    adultNum,
    setAdultNum,
    childNum,
    setChildNum,
    infantNum,
    setInfantNum,
    selectedDates,
    setSelectedDates,
  } = useBookingContext();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const guestModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const snapPointsGuest = useMemo(() => ["50%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handlePresentModalPressGuest = useCallback(() => {
    guestModalRef.current?.present();
  }, [guestModalRef]);

  const renderBackdrop = useCallback(
    (propsBackdrop) => (
      <BottomSheetBackdrop
        {...propsBackdrop}
        enableTouchThrough
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates.slice(1, -1);
  };

  const markedDates = useMemo(() => {
    const unavailabilityMarks = props.unavailability?.reduce((result, date) => {
      result[date] = {
        disabled: true,
      };
      return result;
    }, {});

    const selectedDateMarks = selectedDates?.reduce((result, date, index) => {
      result[date] = {
        selected: true,
        color: "rgb(236, 76, 96)",
        ...(index === 0 && { startingDay: true }),
        ...(index === selectedDates.length - 1 && { endingDay: true }),
      };
      return result;
    }, {});

    return { ...unavailabilityMarks, ...selectedDateMarks };
  }, [props.unavailability, selectedDates]);

  const toggleStartingEndingDays = (day) => {
    if (day.dateString < today || markedDates[day.dateString]?.disabled) {
      // Ignore clicks on past dates or disabled dates
      return;
    }

    if (selectedDates.length === 1 && selectedDates[0] === day.dateString) {
      // Clicking the same date twice, treat it as a new startDay
      setSelectedDates([day.dateString]);
    } else if (selectedDates.length === 1) {
      // Second click
      const firstSelectedDate = selectedDates[0];
      const secondSelectedDate = day.dateString;

      if (firstSelectedDate > secondSelectedDate) {
        // Swap if the dates are selected in reverse order
        setSelectedDates([secondSelectedDate]);
      } else {
        const datesBetween = getDatesBetween(
          firstSelectedDate,
          secondSelectedDate,
        );

        // Check if any disabled dates are in between, if yes, reset
        if (datesBetween.some((date) => markedDates[date]?.disabled)) {
          setSelectedDates([day.dateString]);
        } else {
          setSelectedDates([
            firstSelectedDate,
            ...datesBetween,
            secondSelectedDate,
          ]);
        }
      }
    } else {
      // First click
      setSelectedDates([day.dateString]);
    }
  };

  const handleConfirmPress = () => {
    // Add any additional logic you want to perform when the user confirms
    bottomSheetModalRef.current?.dismiss();
  };

  const handleConfirmPressGuest = () => {
    // Add any additional logic you want to perform when the user confirms
    guestModalRef.current?.dismiss();
  };

  useEffect(() => {
    // Update check-in and check-out dates when selectedDates change
    if (selectedDates.length === 1) {
      setCheckInDate(selectedDates[0]);
      setCheckOutDate(selectedDates[0]); // Initial check-out date is the same as check-in date
      setNightStayCount(0); // Reset night stay count when only check-in date is selected
    } else if (selectedDates.length > 1) {
      setCheckOutDate(selectedDates[selectedDates.length - 1]);
      setNightStayCount(selectedDates.length - 1); // Night stay count is the number of selected dates - 1
    }
  }, [selectedDates]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
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
        {/* 入住时间，退房时间，入住人数 */}
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text style={styles.text}>Check in</Text>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Text style={styles.date}>{checkInDate}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text style={styles.text}>Check out</Text>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Text style={styles.date}>{checkOutDate}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text style={styles.text}>Guests</Text>
          <TouchableOpacity onPress={handlePresentModalPressGuest}>
            <Text style={styles.date}>
              {adultNum + childNum > 1
                ? `${adultNum + childNum} guests`
                : `${adultNum + childNum} guest`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.modalContainer}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backgroundStyle={{ backgroundColor: colors.back1 }}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enableContentPanningGesture={false}
        >
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>Choose Dates</Text>
            <Divider width={1} color={colors.border1} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.text}>Check in</Text>

                <Text style={{ fontSize: 16 }}>{checkInDate}</Text>
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
                <Text style={styles.text}>Check out</Text>
                <Text style={{ fontSize: 16 }}>{checkOutDate}</Text>
              </View>
            </View>
            <Divider width={1} color={colors.border1} />
            {/* 只让props.availability中的日期有效，其他的日期无效 */}
            <CalendarList
              minDate={today}
              maxDate={
                props.availability?.length
                  ? props.availability[props.availability.length - 1]
                  : today
              }
              pastScrollRange={0}
              futureScrollRange={24}
              scrollEnabled
              markingType="period"
              onDayPress={(day) => {
                toggleStartingEndingDays(day);
              }}
              markedDates={markedDates}
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
                textDisabledColor: colors.textSub1Reverse,
              }}
            />
          </View>
          <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <Divider width={1} color={colors.border1} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={handleConfirmPress}
              >
                <Text style={styles.reserveButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </BottomSheetModal>
      </View>

      <View style={styles.modalContainer}>
        <BottomSheetModal
          ref={guestModalRef}
          backgroundStyle={{ backgroundColor: colors.back1 }}
          index={0}
          snapPoints={snapPointsGuest}
          backdropComponent={renderBackdrop}
          enableContentPanningGesture={false}
        >
          <View style={styles.modalGuestContainer}>
            <Text style={styles.modalTitle}>Choose Guests</Text>
            <Divider width={1} color={colors.border1} />
            {/* 成年人，儿童，婴幼儿的数量 */}
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 10,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 15,
                }}
              >
                <Text style={styles.guestType}>Adult</Text>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {adultNum <= 1 ? (
                    <Ionicons
                      style={{ marginRight: 10, marginLeft: 10 }}
                      name="remove-circle-outline"
                      size={32}
                      color={colors.disabled}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginRight: 10, marginLeft: 10 }}
                      name="remove-circle-outline"
                      size={32}
                      color={colors.textSub1Reverse}
                      onPress={() => {
                        if (adultNum > 1) setAdultNum(adultNum - 1);
                      }}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 22,
                      width: 30,
                      textAlign: "center",
                    }}
                  >
                    {adultNum}
                  </Text>
                  {adultNum + childNum >= props.guestCount ? (
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="add-circle-outline"
                      size={32}
                      color={colors.disabled}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="add-circle-outline"
                      size={32}
                      color={colors.textSub1Reverse}
                      onPress={() => {
                        if (adultNum + childNum < props.guestCount)
                          setAdultNum(adultNum + 1);
                      }}
                    />
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 15,
                }}
              >
                <Text style={styles.guestType}>Child</Text>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {childNum <= 0 ? (
                    <Ionicons
                      style={{ marginRight: 10, marginLeft: 10 }}
                      name="remove-circle-outline"
                      size={32}
                      color={colors.disabled}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginRight: 10, marginLeft: 10 }}
                      name="remove-circle-outline"
                      size={32}
                      color={colors.textSub1Reverse}
                      onPress={() => {
                        if (childNum > 0) setChildNum(childNum - 1);
                      }}
                    />
                  )}

                  <Text
                    style={{
                      fontSize: 22,
                      width: 30,
                      textAlign: "center",
                    }}
                  >
                    {childNum}
                  </Text>

                  {adultNum + childNum >= props.guestCount ? (
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="add-circle-outline"
                      size={32}
                      color={colors.disabled}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="add-circle-outline"
                      size={32}
                      color={colors.textSub1Reverse}
                      onPress={() => {
                        if (adultNum + childNum < props.guestCount)
                          setChildNum(childNum + 1);
                      }}
                    />
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 15,
                }}
              >
                <Text style={styles.guestType}>Infant</Text>
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {infantNum <= 0 ? (
                    <Ionicons
                      style={{ marginRight: 10, marginLeft: 10 }}
                      name="remove-circle-outline"
                      size={32}
                      color={colors.disabled}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginRight: 10, marginLeft: 10 }}
                      name="remove-circle-outline"
                      size={32}
                      color={colors.textSub1Reverse}
                      onPress={() => {
                        if (infantNum > 0) setInfantNum(infantNum - 1);
                      }}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 22,

                      width: 30,
                      textAlign: "center",
                    }}
                  >
                    {infantNum}
                  </Text>

                  {infantNum >= 29 ? (
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="add-circle-outline"
                      size={32}
                      color={colors.disabled}
                    />
                  ) : (
                    <Ionicons
                      style={{ marginLeft: 10 }}
                      name="add-circle-outline"
                      size={32}
                      color={colors.textSub1Reverse}
                      onPress={() => {
                        if (infantNum < 29) setInfantNum(infantNum + 1);
                      }}
                    />
                  )}
                </View>
              </View>
            </View>

            <View
              style={{
                height: "25%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "gray",
                }}
              >
                Up to {props.guestCount} guests. Infants and toddlers are not
                counted as guests.
              </Text>
            </View>
          </View>
          <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <Divider width={1} color={colors.border1} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={handleConfirmPressGuest}
              >
                <Text style={styles.reserveButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </BottomSheetModal>
      </View>
    </SafeAreaView>
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
  safeArea: {
    width: "100%",
    position: "absolute",
    ...Platform.select({
      ios: {
        bottom: 20,
      },
      android: {
        bottom: 0,
      },
    }),
  },
  text: {
    fontSize: 12,
  },
  date: {
    fontSize: 16,
    color: "rgb(21, 124, 197)",
  },
  modalContainer: {
    flex: 1,
  },
  modalContentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    marginBottom: 200,
  },
  modalGuestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    marginBottom: 50,
  },
  modalTitle: {
    fontSize: 18,
    paddingVertical: 10,
  },
  reserveButton: {
    backgroundColor: "rgb(236, 76, 96)",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  reserveButtonText: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
  },
  guestType: {
    fontSize: 22,
  },
});

export default CheckIn;
