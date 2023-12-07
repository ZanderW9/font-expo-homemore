import React, { useContext, useState } from "react";

const PostContext = React.createContext({});

const PostProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  return (
    <PostContext.Provider
      value={{
        orders,
        setOrders,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const useOrderContext = () => useContext(PostContext);

export default PostProvider;
