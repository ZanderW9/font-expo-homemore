import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
  },
  filterCard: {
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.11,
    marginBottom: 5,
  },
  priceRangeContainer: {
    width: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  searchBarContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#000",
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 0,
    paddingRight: 0,
  },
  searchInputContainer: {
    backgroundColor: "transparent",
  },
  searchInput: {
    backgroundColor: "transparent",
  },
});
