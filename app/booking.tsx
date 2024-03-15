import BookingProvider from "@components/booking/BookingProvider";
import MyBooking from "@components/booking/MyBooking";

function Booking() {
  return (
    <BookingProvider>
      <MyBooking />
    </BookingProvider>
  );
}

export default Booking;
