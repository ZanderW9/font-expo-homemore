import { useQuery } from "@apollo/client";
import { SEARCH_LISTINGS_QUERY } from "@config/gql/search";
import { router } from "expo-router";
import React, { ReactNode, useContext, useState, useReducer } from "react";
import { Keyboard } from "react-native";

const SearchContext = React.createContext({
  text: "",
  setText: (text: string) => {},
  filters: { price: { gte: "100", lte: "1000" } },
  dispatchFilters: ({ price }: { price: object }) => {},
  boundary: {},
  setBoundary: (boundary: object) => {},
  onSearch: () => {},
  onClearText: () => {},
  data: {},
  loading: false,
  // fetchMore: () => {},
  refetch: () => {},
});

const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState("");
  const [filters, dispatchFilters] = useReducer(
    (state: object, newState: object) => ({ ...state, ...newState }),
    {
      price: { gte: "100", lte: "1000" },
    },
  );
  const [boundary, setBoundary] = useState({});

  const { data, loading, refetch, fetchMore } = useQuery(
    SEARCH_LISTINGS_QUERY,
    {
      variables: {
        text,
        filters,
      },
      errorPolicy: "all",
    },
  );

  const onClearText = () => {
    setText("");
    refetch({ text: "", filters });
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
        data,
        loading,
        fetchMore,
        refetch,
        text,
        setText,
        filters,
        dispatchFilters,
        boundary,
        setBoundary,
        onSearch,
        onClearText,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);

export default SearchProvider;
