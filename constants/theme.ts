import Colors from "@constants/Colors";
import { useColorScheme } from "react-native";

export const useThemedColors = () => {
  const colorScheme = useColorScheme() ?? "light";
  return Colors[colorScheme];
};
