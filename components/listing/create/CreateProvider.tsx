import React, { useContext, useReducer, ReactNode } from "react";

type CreateListingState = {
  listingId?: string;
  serviceType?: string;
  placeType?: string;
  rentType?: string;
  address?: {
    unit: string;
    city: string;
    state: string;
    street: string;
    postCode: string;
    country: string;
  };
  placeDetails?: {
    guestCount: number;
    bedroomCount: number;
    bedCount: number;
    bathCount: number;
  };
  bedRoomDetails?: [];
  device?: string[];
  safetyDevice?: string[];
  guestType?: string[];
  images?: string[];
  title?: string;
  description?: string;
  orderType?: string;
  price?: string;
  discount?: { discountType: string; discountValue: string }[];
  searchHistory?: {
    description: string;
    geometry: { location: { lat: number; lng: number } };
  }[];
};

const initialState: CreateListingState = {
  listingId: "",
  serviceType: "rent",
  placeType: "",
  rentType: "",
  address: {
    unit: "",
    city: "",
    state: "",
    street: "",
    postCode: "",
    country: "",
  },
  placeDetails: { guestCount: 1, bedroomCount: 0, bedCount: 1, bathCount: 0.5 },
  bedRoomDetails: [],
  device: [],
  safetyDevice: [],
  guestType: [],
  images: [],
  title: "",
  description: "",
  orderType: "",
  price: "",
  discount: [],
  searchHistory: [],
};

interface CreateListingContextType {
  listingData: CreateListingState;
  dispatchListingData: (newState: CreateListingState) => void;
  resetListingData: () => void;
}

const CreateListingContext = React.createContext<CreateListingContextType>({
  listingData: initialState,
  dispatchListingData: () => {},
  resetListingData: () => {},
});

const CreateListingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [listingData, dispatchListingData] = useReducer(
    (state: CreateListingState, newState: Partial<CreateListingState>) => ({
      ...state,
      ...newState,
    }),
    initialState,
  );

  const resetListingData = () => {
    dispatchListingData(initialState);
  };

  return (
    <CreateListingContext.Provider
      value={{ listingData, dispatchListingData, resetListingData }}
    >
      {children}
    </CreateListingContext.Provider>
  );
};

export const useCreateListingContext = () => useContext(CreateListingContext);

export default CreateListingProvider;
