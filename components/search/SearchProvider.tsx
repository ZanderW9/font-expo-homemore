import { useQuery } from "@apollo/client";
import { SEARCH_LISTINGS_QUERY } from "@config/gql/search";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, {
  ReactNode,
  useContext,
  useReducer,
  useState,
  useEffect,
} from "react";
import { Keyboard } from "react-native";

type SearchState = {
  text?: string;
  price?: { gte: number; lte: number };
  boundary?: object;
  // priceBy?: string;
  propertyType?: string;
  placeType?: string;
  serviceType?: string;
  amenities?: string[];
};

const initialState: SearchState = {
  text: "",
  price: { gte: 0, lte: 1500 },
  boundary: {},
  // priceBy: "week",
  placeType: "room",
  propertyType: "apartment",
  serviceType: "rent",
  amenities: [],
};

type CenterProps = {
  lat: number;
  lng: number;
  latDelta: number;
  lngDelta: number;
};

interface SearchContextType {
  filters: SearchState;
  dispatchFilters: (newState: SearchState) => void;
  center: CenterProps | null;
  setCenter: (newCenter: CenterProps) => void;
  onSearch: () => void;
  data: object;
  loading: boolean;
  fetchMore: Function;
  refetch: () => void;
  clearFilters: () => void;
}
const SearchContext = React.createContext<SearchContextType>({
  filters: initialState,
  dispatchFilters: () => {},
  center: null,
  setCenter: () => {},
  onSearch: () => {},
  data: {},
  loading: false,
  fetchMore: () => {},
  refetch: () => {},
  clearFilters: () => {},
});

const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, dispatchFilters] = useReducer(
    (state: object, newState: object) => ({ ...state, ...newState }),
    initialState,
  );

  const [center, setCenter] = useState<CenterProps | null>(null);
  useEffect(() => {
    (async () => {
      const userLocation = await AsyncStorage.getItem("mapCenter");
      if (userLocation) {
        setCenter(JSON.parse(userLocation));
      }
    })();
  }, []);

  const { data, loading, refetch, fetchMore } = useQuery(
    SEARCH_LISTINGS_QUERY,
    {
      variables: {
        filters,
      },
      errorPolicy: "all",
    },
  );

  const clearFilters = () => {
    dispatchFilters(initialState);
  };

  const onSearch = () => {
    refetch();
    Keyboard.dismiss();
    console.log("search filters:", filters);
    router.navigate("/search-result");
  };

  return (
    <SearchContext.Provider
      value={{
        filters,
        dispatchFilters,
        center,
        setCenter,
        data,
        loading,
        fetchMore,
        refetch,
        onSearch,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);

export default SearchProvider;
