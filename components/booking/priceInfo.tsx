import { Text, View } from "@components/Themed";
import { useBookingContext } from "@components/booking/bookingProvider";
import { useThemedColors } from "@constants/theme";
import { StyleSheet } from "react-native";

function PriceInfo(data: any) {
  const colors = useThemedColors();
  const { nightStayCount } = useBookingContext();

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
          <Text style={styles.title}>Price detail </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.subtitle}>Total Price (AUD)</Text>
            <Text style={styles.subtitle}>
              {nightStayCount > 1
                ? `${nightStayCount} nights`
                : `${nightStayCount} night`}
            </Text>
            <Text style={styles.subtitle}>${data.price * nightStayCount}</Text>
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

export default PriceInfo;
