import { Text, View } from "@components/Themed";
import { useBookingContext } from "@components/booking/BookingProvider";
import { useThemedColors } from "@constants/theme";
import { useEffect } from "react";
import { StyleSheet } from "react-native";

function PriceInfo(props: any) {
  const colors = useThemedColors();
  const { nightStayCount, discount, setDiscount } = useBookingContext();
  const weekDiscount = props?.discount?.find(
    (discount: any) => discount.discountType === "week",
  );

  const monthDiscount = props?.discount?.find(
    (discount: any) => discount.discountType === "month",
  );

  useEffect(() => {
    if (nightStayCount >= 7 && weekDiscount) {
      setDiscount(weekDiscount.discountValue);
    } else if (nightStayCount >= 28 && monthDiscount) {
      setDiscount(monthDiscount.discountValue);
    } else {
      setDiscount(0);
    }
  }, [nightStayCount]);

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
              marginTop: 10,
            }}
          >
            <Text style={styles.subtitle}>Price per night</Text>
            <Text style={styles.subtitle}>${props.price}</Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {/* discount */}
            <Text style={[styles.subtitle, { width: "40%" }]}>Discount</Text>
            <Text
              style={{
                width: "20%",
                color: colors.textSub1Reverse,
                fontSize: 14,
              }}
            >
              {discount}%
            </Text>
            <Text style={styles.subtitle}>
              -$
              {(
                (props.price * nightStayCount * (discount / 100)) as number
              ).toFixed()}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={[styles.subtitle, { width: "40%" }]}>Total Price</Text>
            <Text
              style={{
                width: "20%",
                color: colors.textSub1Reverse,
                fontSize: 14,
              }}
            >
              {nightStayCount > 1
                ? `${nightStayCount} nights`
                : `${nightStayCount} night`}
            </Text>
            <Text style={styles.subtitle}>
              ${(props.price * nightStayCount * (1 - discount / 100)).toFixed()}
            </Text>
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
