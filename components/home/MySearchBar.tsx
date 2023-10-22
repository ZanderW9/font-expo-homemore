import { SearchBar } from "@rneui/themed";
import React, { useState } from "react";
type SearchBarComponentProps = object;

const MySearchBar: React.FunctionComponent<SearchBarComponentProps> = () => {
  const [search, setSearch] = useState("");

  const updateSearch = () => {
    setSearch(search);
  };

  return (
    <SearchBar
      containerStyle={{
        backgroundColor: "transparent",
        width: "100%",
        borderBlockColor: "transparent",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
      }}
      inputContainerStyle={{
        backgroundColor: "transparent",
        width: "100%",
        borderBottomWidth: 1,
      }}
      placeholder="Type Here..."
      onChangeText={updateSearch}
      value={search}
    />
  );
};

export default MySearchBar;
