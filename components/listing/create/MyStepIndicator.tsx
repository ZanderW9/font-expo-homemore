import { useThemedColors } from "@constants/theme";
import React from "react";
import StepIndicator from "react-native-step-indicator";

function MyStepIndicator(props: React.ComponentProps<typeof StepIndicator>) {
  const colors = useThemedColors();

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colors.mainColor,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colors.mainColor,
    stepStrokeUnFinishedColor: "#aaaaaa",
    separatorFinishedColor: colors.mainColor,
    separatorUnFinishedColor: "#aaaaaa",
    stepIndicatorFinishedColor: colors.mainColor,
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: colors.mainColor,
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: colors.mainColor,
  };

  return (
    <StepIndicator
      customStyles={customStyles}
      currentPosition={props.currentPosition}
      stepCount={props.stepCount}
      labels={props.labels}
    />
  );
}

export default MyStepIndicator;
