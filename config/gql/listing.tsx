import { gql } from "@apollo/client";

export const DETAIL_PAGE_LISTING_QUERY = gql`
  query detailPageListingById($listingId: String!) {
    listingById(listingId: $listingId) {
      id
      title
      description
      images {
        url
        smallUrl
        thumbhash
        width
        height
      }
      price
      address
      coordinate
      favorited
      availability
      unavailability
      createdAt
      publishAt
      placeType
      rentType
      roomDetails
      deviceType
      standoutType
      safetyDeviceType
      guestType
      owner {
        userName
        avatar
        id
      }
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
          avatar
        }
        subReviews {
          text
          id
          createdAt
          sender {
            id
            userName
            avatar
          }
          receiver {
            id
            userName
            avatar
          }
        }
      }
    }
  }
`;

export const BOOKING_PAGE_LISTING_QUERY = gql`
  query myBookingQuery($listingId: String!) {
    listingById(listingId: $listingId) {
      id
      title
      images {
        smallUrl
        thumbhash
      }
      price
      address
      coordinate
      availability
      unavailability
      placeType
      rentType
      roomDetails
      roomDetails
      deviceType
      standoutType
      owner {
        userName
      }
    }
  }
`;

export const CREATE_LISTING_PAGE_QUERY = gql`
  query createPageListingQuery($listingId: String!) {
    listingById(listingId: $listingId) {
      id
      title
      description
      images {
        url
        smallUrl
        thumbhash
        ratio
        width
        height
      }
      price
      address
      coordinate
      favorited
      availability
      unavailability
      createdAt
      publishAt
      placeType
      rentType
      roomDetails
      deviceType
      standoutType
      safetyDeviceType
      guestType
      meta
      owner {
        userName
      }
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
        }
        subReviews {
          text
          id
          createdAt
          sender {
            id
            userName
          }
        }
      }
    }
  }
`;

export const LISTING_REVIEW_QUERY = gql`
  query listingReviewsQuery($listingId: String!) {
    listingById(listingId: $listingId) {
      reviews {
        id
        text
        createdAt
        sender {
          id
          userName
        }
      }
    }
  }
`;
