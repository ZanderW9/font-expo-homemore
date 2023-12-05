import React, { useContext, useState } from "react";

const OrderContext = React.createContext({});

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);

export default OrderProvider;
