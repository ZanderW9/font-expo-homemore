import { View } from "@components/Themed";
import UnpublishedCard from "@components/post/UnpublishedCard";
import MasonryList from "@react-native-seoul/masonry-list";
import { StyleSheet } from "react-native";

function Unpublished(data: any) {
  return (
    <View theme={{ background: "back2" }}>
      <MasonryList
        style={styles.container}
        data={data.unpublished ? data.unpublished : []}
        numColumns={2}
        renderItem={({ item }) => <UnpublishedCard data={item} />}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Unpublished;
