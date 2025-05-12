import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fatchData = async (url: string, method: string, body?: object) => {
  const token = await AsyncStorage.getItem("userToken");
  const requestOption = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  };
  try {
    const response = await fetch(`${BACKEND_URL}${url}`, requestOption);
    if (response.ok) {
      const data = await response.json();
      return { data, ok: true };
    } else {
      const data = await response.json();
      return { error: data.error, ok: false };
    }
  } catch {
    return { error: "Lost connection...", ok: false };
  }
};

export const sendVerificationEmailRequest = async (email: string) => {
  const body = { email };
  const response = await fatchData(
    "/api/send-verification-email",
    "POST",
    body,
  );
  return response;
};

export const registerRequest = async (body: object) => {
  const response = await fatchData("/api/users/register", "POST", body);
  return response;
};

export const loginRequest = async (body: object) => {
  const response = await fatchData("/api/users/login", "POST", body);
  return response;
};

export const changePasswordRequest = async (body: object) => {
  const response = await fatchData("/api/users/changePassword", "POST", body);
  return response;
};

export const forgetPasswordRequest = async (body: object) => {
  const response = await fatchData("/api/users/forgetPassword", "POST", body);
  return response;
};

export const userExistRequest = async (email: string) => {
  const body = { email };
  const response = await fatchData("/api/users/exist", "POST", body);
  return response;
};

export const getUserBaseInfoRequest = async () => {
  const response = await fatchData("/api/users/baseInfo", "POST");
  return response;
};

export const addOrRemoveFavoriteListRequest = async (id: string) => {
  const body = { id };
  const response = await fatchData("/api/users/favorites", "POST", body);
  return response;
};

export const getUserFavoriteListRequest = async () => {
  const response = await fatchData("/api/users/favorites/get", "GET");
  return response;
};

export const getFavoriteDetailsRequest = async (page: string) => {
  const response = await fatchData(
    `/api/users/favorites/details?page=${page}`,
    "GET",
  );
  return response;
};

export const createListingRequest = async (body: { price: number }) => {
  const response = await fatchData("/api/listings/new", "POST", body);
  return response;
};

export const updateListingRequest = async (
  id: string,
  body: { price: number },
) => {
  const response = await fatchData(
    `/api/listings/update?id=${id}`,
    "PUT",
    body,
  );
  return response;
};

export const deleteListingRequest = async (id: string) => {
  const response = await fatchData(`/api/listings/remove?id=${id}`, "DELETE");
  return response;
};

export const allListPubRequest = async (page: number) => {
  // Get listings for a specific page
  const response = await fatchData(
    `/api/listings/publish/all?page=${page}`,
    "GET",
  );
  return response;
};

export const allListOfUserRequest = async () => {
  // Get listings for a specific user
  const response = await fatchData(`/api/listings/user`, "GET");
  return response;
};

export const getSingleListing = async (id: string) => {
  // then get one listing
  const response = await fatchData(`/api/listings/one?id=${id}`, "GET");
  return response;
};

export const bookingListOfUserRequest = async () => {
  // Listings that involve bookings made by the customer with status `accepted` or `pending`
  //should appear first in the list (if the user is logged in)
  const response = await fatchData("/api/bookings/user", "GET");
  return response;
};

export const bookingListOfListingRequest = async (id: string) => {
  const response = await fatchData(`/api/bookings/listing?id=${id}`, "GET");
  return response;
};

export const saveReviewRequest = async (review: {
  listingId: string;
  bookingId: string;
}) => {
  // Listings that involve bookings made by the customer with status `accepted` or `pending`
  //should appear first in the list (if the user is logged in)
  const body = { review };
  const response = await fatchData(
    `/api/listings/review?listingId=${review.listingId}?bookingId=${review.bookingId}`,
    "PUT",
    body,
  );
  return response;
};

export const addBookingRequest = async (booking: {
  dateRange: string[];
  totalPrice: number;
  listingTitle: string;
  listingId: string;
}) => {
  // Listings that involve bookings made by the customer with status `accepted` or `pending`
  //should appear first in the list (if the user is logged in)
  const body = {
    dateRange: booking.dateRange,
    totalPrice: booking.totalPrice,
    listingTitle: booking.listingTitle,
  };
  const response = await fatchData(
    `/api/bookings/new?id=${booking.listingId}`,
    "POST",
    body,
  );
  return response;
};

export const publishListingRequest = async (id: string, body: object) => {
  const response = await fatchData(
    `/api/listings/publish?id=${id}`,
    "PUT",
    body,
  );
  return response;
};

export const unPublishListingRequest = async (id: string) => {
  const response = await fatchData(`/api/listings/unpublish?id=${id}`, "PUT");
  return response;
};

export const acceptBooking = async (id: string) => {
  const response = await fatchData(`/api/bookings/accept?id=${id}`, "PUT");
  return response;
};

export const declineBooking = async (id: string) => {
  const response = await fatchData(`/api/bookings/decline?id=${id}`, "PUT");
  return response;
};

export const getStartAndEndDates = async (id: string) => {
  const response = await fatchData(
    `/api/bookings/availableDates?id=${id}`,
    "GET",
  );
  return response;
};

export const addFavoriteFolderRequest = async (name: string) => {
  const body = { name };
  const response = await fatchData("/api/favorites/folder/add", "POST", body);
  return response;
};

export const removeFavoriteFolderRequest = async (name: string) => {
  const body = { name };
  const response = await fatchData(
    "/api/favorites/folder/remove",
    "POST",
    body,
  );
  return response;
};

export const getFavoriteFolderRequest = async () => {
  const response = await fatchData("/api/favorites/folder/get", "GET");
  return response;
};

export const addFavoriteToFolderRequest = async (body: {
  folderName: string;
  listingId: string;
}) => {
  const response = await fatchData("/api/favorites/add", "POST", body);
  return response;
};

export const removeFavoriteFromFolderRequest = async (body: {
  folderName: string;
  listingId: string;
}) => {
  const response = await fatchData("/api/favorites/remove", "POST", body);
  return response;
};

export const getFavoriteDetailsOfFolderRequest = async (body: {
  folderName: string;
}) => {
  const response = await fatchData("/api/favorites/details", "POST", body);
  return response;
};
