import { useQuery } from "@apollo/client";
import { SEARCH_LISTINGS_QUERY } from "@config/gql/search";
import { router } from "expo-router";
import React, { ReactNode, useContext, useReducer } from "react";
import { Keyboard } from "react-native";

type SearchState = {
  text?: string;
  price?: { gte: string; lte: string };
  boundary?: object;
};

const initialState: SearchState = {
  text: "",
  price: { gte: "100", lte: "1000" },
  boundary: {},
};

interface SearchContextType {
  filters: SearchState;
  dispatchFilters: (newState: SearchState) => void;
  onSearch: () => void;
  data: object;
  loading: boolean;
  fetchMore: Function;
  refetch: () => void;
}
const SearchContext = React.createContext<SearchContextType>({
  filters: initialState,
  dispatchFilters: () => {},
  onSearch: () => {},
  data: {},
  loading: false,
  fetchMore: () => {},
  refetch: () => {},
});

const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, dispatchFilters] = useReducer(
    (state: object, newState: object) => ({ ...state, ...newState }),
    initialState,
  );

  const { data, loading, refetch, fetchMore } = useQuery(
    SEARCH_LISTINGS_QUERY,
    {
      variables: {
        filters,
      },
      errorPolicy: "all",
    },
  );

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
        data,
        loading,
        fetchMore,
        refetch,
        onSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);

export default SearchProvider;
