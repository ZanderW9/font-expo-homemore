import { View } from "@components/Themed";
import { Image } from "expo-image";
import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

function MyCarousel(data: any) {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const PAGE_HEIGHT = Dimensions.get("window").height;
  const progressValue = useSharedValue<number>(0);

  const MAX_IMAGE_HEIGHT = PAGE_HEIGHT * 0.6;
  let maxImageHeight = 300;
  if (data?.images?.length > 0) {
    const imagesHeights = data?.images?.map(
      (image) => (PAGE_WIDTH / image.width) * image.height,
    );
    maxImageHeight = Math.min(Math.max(...imagesHeights), MAX_IMAGE_HEIGHT);
  }

  return (
    <View>
      <Carousel
        vertical={false}
        width={PAGE_WIDTH}
        height={maxImageHeight}
        loop={false}
        pagingEnabled
        snapEnabled
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={data.images ? data.images : []}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.smallUrl }}
            cachePolicy="memory-disk"
            placeholder={{ thumbhash: item.thumbhash }}
            style={{
              width: "100%",
              height: maxImageHeight,
            }}
            contentFit="contain"
          />
        )}
      />
      {data.images && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          {data?.images?.map((_, index) => {
            return (
              <PaginationItem
                key={index}
                index={index}
                length={data?.images?.length || 1}
                backgroundColor="rgb(236, 76, 96)"
                animValue={progressValue}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const PaginationItem: React.FC<{
  index: number;
  backgroundColor: string;
  length: number;
  animValue: Animated.SharedValue<number>;
}> = (props) => {
  const { animValue, index, length, backgroundColor } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        width,
        height: width,
        borderRadius: 50,
        overflow: "hidden",
        transform: [
          {
            rotateZ: "0deg",
          },
        ],
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export default MyCarousel;
