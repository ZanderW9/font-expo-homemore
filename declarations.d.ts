declare module "@env" {
  // ... other environment variables you want to use
}

declare global {
  interface Navigator {
    geolocation: any;
  }
}
export {};
