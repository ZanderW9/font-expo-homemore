import { View } from "@components/Themed";
import { Image } from "@rneui/themed";
import React, { useEffect, useState } from "react";
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
  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
  };

  const MAX_IMAGE_HEIGHT = PAGE_HEIGHT * 0.65;
  const [maxImageWidth, setMaxImageWidth] = useState(0);
  const [maxImageHeight, setMaxImageHeight] = useState(0);

  const adjustedImageWidth = Math.min(PAGE_WIDTH, maxImageWidth);
  const adjustedImageHeight = Math.min(MAX_IMAGE_HEIGHT, maxImageHeight);

  useEffect(() => {
    let isMounted = true;

    const calculateMaxSize = () => {
      if (data.images) {
        // 遍历图片数组，获取图片尺寸
        const imageSizePromises = data.images.map((image: any) => {
          return new Promise((resolve) => {
            Image.getSize(image, (width, height) => {
              if (width > PAGE_WIDTH) {
                height = (PAGE_WIDTH / width) * height;
                width = PAGE_WIDTH;
              } else if (height > MAX_IMAGE_HEIGHT) {
                width = (MAX_IMAGE_HEIGHT / height) * width;
                height = MAX_IMAGE_HEIGHT;
              }
              resolve({ width, height });
            });
          });
        });

        Promise.all(imageSizePromises).then((imageSizes) => {
          // 计算最大宽度和最大高度
          let maxWidth = 0;
          let maxHeight = 0;

          imageSizes.forEach(({ width, height }) => {
            maxWidth = Math.max(maxWidth, width);
            maxHeight = Math.max(maxHeight, height);
          });

          // 设置状态
          if (isMounted) {
            setMaxImageWidth(maxWidth);
            setMaxImageHeight(maxHeight);
          }
        });
      }
    };

    calculateMaxSize();

    return () => {
      isMounted = false;
    };
  }, [data.images]);

  return (
    <View>
      <Carousel
        {...baseOptions}
        style={{
          width: adjustedImageWidth,
          height: adjustedImageHeight,
        }}
        loop
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
            source={{ uri: item }}
            style={{
              width: adjustedImageWidth,
              height: adjustedImageHeight,
            }}
            resizeMode="contain"
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
          {data.images.map((_, index) => {
            return (
              <PaginationItem
                key={index}
                index={index}
                length={data.images.length}
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
