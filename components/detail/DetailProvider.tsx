import React, { useContext, useState } from "react";

const DetailContext = React.createContext({});

const DetailProvider = ({ children }) => {
  const [reviewId, setReviewId] = useState(0);

  return (
    <DetailContext.Provider
      value={{
        reviewId,
        setReviewId,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => useContext(DetailContext);

export default DetailProvider;
