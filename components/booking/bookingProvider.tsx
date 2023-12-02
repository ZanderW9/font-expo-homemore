import React, { useContext, useState } from "react";

const BookingContext = React.createContext({});

const BookingProvider = ({ children }) => {
  const [nightStayCount, setNightStayCount] = useState(0);
  const [adultNum, setAdultNum] = useState(1);
  const [childNum, setChildNum] = useState(0);
  const [infantNum, setInfantNum] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);

  return (
    <BookingContext.Provider
      value={{
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
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => useContext(BookingContext);

export default BookingProvider;
