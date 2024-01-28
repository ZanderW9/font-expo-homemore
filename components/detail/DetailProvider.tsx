import React, { useContext, useState } from "react";

const DetailContext = React.createContext({});

const DetailProvider = ({ children }) => {
  const [reviewId, setReviewId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [reviewOwner, setReviewOwner] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [longPressReviewId, setLongPressReviewId] = useState("");

  return (
    <DetailContext.Provider
      value={{
        reviewId,
        setReviewId,
        receiverId,
        setReceiverId,
        receiverName,
        setReceiverName,
        reviewOwner,
        setReviewOwner,
        reviewText,
        setReviewText,
        longPressReviewId,
        setLongPressReviewId,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => useContext(DetailContext);

export default DetailProvider;
