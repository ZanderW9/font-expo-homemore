import { LinkPreview as DefaultLinkPreview } from "@flyerhq/react-native-link-preview";
import { Image } from "expo-image";

import { View, Text } from "@/components/Themed";

export function LinkPreview({ text }: { text: string }) {
  return (
    <DefaultLinkPreview
      text={text}
      containerStyle={{ width: "100%" }}
      renderLinkPreview={(link) => {
        console.log(link);
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                marginRight: 15,
                marginLeft: 5,
                marginBottom: 5,
              }}
            >
              <Text
                style={{ fontWeight: "500" }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {link.previewData?.title}
              </Text>
              <Text
                theme={{ color: "textSub1" }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {link.previewData?.description}
              </Text>
            </View>
            <View>
              <Image
                source={{ uri: link.previewData?.image?.url }}
                style={{ width: 80, height: 80, borderRadius: 5 }}
              />
            </View>
          </View>
        );
      }}
    />
  );
}
