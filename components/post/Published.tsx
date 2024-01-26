import { View } from "@components/Themed";
import PublishedCard from "@components/post/PublishedCard";
import MasonryList from "@react-native-seoul/masonry-list";
import { StyleSheet } from "react-native";

function Published(data: any) {
  return (
    <View>
      <MasonryList
        style={styles.container}
        data={data.published ? data.published : []}
        numColumns={2}
        renderItem={({ item }) => <PublishedCard data={item} />}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default Published;
