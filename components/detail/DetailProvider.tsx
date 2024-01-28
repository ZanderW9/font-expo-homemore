import React, { ReactNode, useContext, useReducer } from "react";

type ReviewState = {
  reviewId?: string | null;
  receiverId?: string | null;
  receiverName?: string;
  reviewOwner?: string;
  reviewText?: string;
  longPressReviewId?: string;
};

interface DetailContextType {
  reviewData: ReviewState;
  dispatchReviewData: (newState: ReviewState) => void;
  resetReviewData: () => void;
}

const initialState: ReviewState = {
  reviewId: null,
  receiverId: null,
  receiverName: "",
  reviewOwner: "",
  reviewText: "",
  longPressReviewId: "",
};

const DetailContext = React.createContext<DetailContextType>({
  reviewData: initialState,
  dispatchReviewData: () => {},
  resetReviewData: () => {},
});

const DetailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviewData, dispatchReviewData] = useReducer(
    (state: ReviewState, newState: ReviewState) => ({ ...state, ...newState }),
    initialState,
  );

  const resetReviewData = () => {
    dispatchReviewData({
      reviewId: null,
      receiverId: null,
      receiverName: "",
      reviewOwner: "",
      reviewText: "",
      longPressReviewId: "",
    });
  };

  return (
    <DetailContext.Provider
      value={{
        reviewData,
        dispatchReviewData,
        resetReviewData,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => useContext(DetailContext);

export default DetailProvider;
