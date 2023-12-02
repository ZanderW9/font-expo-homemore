import BookingProvider from "@components/booking/bookingProvider";
import MyBooking from "@components/booking/myBooking";

function Booking() {
  return (
    <BookingProvider>
      <MyBooking />
    </BookingProvider>
  );
}

export default Booking;
