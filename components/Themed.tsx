/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import Colors from "@constants/Colors";
import React from "react";
import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  TouchableOpacity as DefaultTouchableOpacity,
  Pressable as DefaultPressable,
  KeyboardAvoidingView as DefaultKeyboardAvoidingView,
} from "react-native";
import { SafeAreaView as DefaultSafeAreaView } from "react-native-safe-area-context";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  theme?: {
    background?: string;
    border?: string;
    color?: string;
  };
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type SafeAreaViewProps = ThemeProps &
  React.ComponentProps<typeof DefaultSafeAreaView>;
export type ScrollViewProps = ThemeProps &
  React.ComponentProps<typeof DefaultScrollView>;
export type TouchableOpacityProps = ThemeProps &
  React.ComponentProps<typeof DefaultTouchableOpacity>;
export type PressableProps = ThemeProps &
  React.ComponentProps<typeof DefaultPressable>;
export type KeyboardAvoidingViewProps = ThemeProps &
  React.ComponentProps<typeof DefaultKeyboardAvoidingView>;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({}, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, theme, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    {},
    (theme?.background as keyof typeof Colors.light) || "back1",
  );

  const borderColor = useThemeColor(
    {},
    (theme?.border as keyof typeof Colors.light) || "border1",
  );

  return (
    <DefaultView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, theme, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    {},
    (theme?.background as keyof typeof Colors.light) || "back1",
  );

  const borderColor = useThemeColor(
    {},
    (theme?.border as keyof typeof Colors.light) || "border1",
  );
  return (
    <DefaultSafeAreaView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function ScrollView(props: ScrollViewProps) {
  const { style, theme, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    {},
    (theme?.background as keyof typeof Colors.light) || "back1",
  );

  const borderColor = useThemeColor(
    {},
    (theme?.border as keyof typeof Colors.light) || "border1",
  );

  return (
    <DefaultScrollView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, theme, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    {},
    (theme?.background as keyof typeof Colors.light) || "back1",
  );

  const borderColor = useThemeColor(
    {},
    (theme?.border as keyof typeof Colors.light) || "border1",
  );

  return (
    <DefaultTouchableOpacity
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function Pressable(props: PressableProps) {
  const { style, theme, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    {},
    (theme?.background as keyof typeof Colors.light) || "back1",
  );

  const borderColor = useThemeColor(
    {},
    (theme?.border as keyof typeof Colors.light) || "border1",
  );

  return (
    <DefaultPressable
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}

export function KeyboardAvoidingView(props: KeyboardAvoidingViewProps) {
  const { style, theme, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    {},
    (theme?.background as keyof typeof Colors.light) || "back1",
  );

  const borderColor = useThemeColor(
    {},
    (theme?.border as keyof typeof Colors.light) || "border1",
  );

  return (
    <DefaultKeyboardAvoidingView
      style={[{ backgroundColor, borderColor }, style]}
      {...otherProps}
    />
  );
}
