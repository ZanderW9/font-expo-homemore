import { gql } from "@apollo/client";

export const SEARCH_LISTINGS_QUERY = gql`
  query searchListingsQuery($text: String, $filters: Json) {
    searchListings(text: $text, filters: $filters) {
      id
      title
      description
      images {
        smallUrl
        thumbhash
        ratio
      }
      price
      favorited
      address
    }
  }
`;
