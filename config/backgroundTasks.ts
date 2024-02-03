// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";

// const LOCATION_TASK_NAME = "background-location-task";

// export const requestLocationPermissions = async () => {
//   const { status: foregroundStatus } =
//     await Location.requestForegroundPermissionsAsync();
//   if (foregroundStatus === "granted") {
//     const { status: backgroundStatus } =
//       await Location.requestBackgroundPermissionsAsync();
//     if (backgroundStatus === "granted") {
//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.Balanced,
//       });
//     }
//   }
// };

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     // Error occurred - check `error.message` for more details.
//     console.log("error");
//     return;
//   }
//   if (data) {
//     console.log("ready");
//     const { locations } = data;
//     console.log("locations", locations);
//   }
// });
