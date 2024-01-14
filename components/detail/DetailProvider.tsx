import React, { useContext, useState } from "react";

const DetailContext = React.createContext({});

const DetailProvider = ({ children }) => {
  const [reviewId, setReviewId] = useState(0);
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");

  return (
    <DetailContext.Provider
      value={{
        reviewId,
        setReviewId,
        receiverId,
        setReceiverId,
        receiverName,
        setReceiverName,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => useContext(DetailContext);

export default DetailProvider;
