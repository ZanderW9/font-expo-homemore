import { gql } from "@apollo/client";

export const SEARCH_LISTINGS_QUERY = gql`
  query searchListingsQuery($filters: Json) {
    searchListings(filters: $filters) {
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
