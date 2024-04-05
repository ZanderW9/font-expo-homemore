import ListingCard from "@components/ListingCard";
import { View } from "@components/Themed";
import MasonryList from "@react-native-seoul/masonry-list";
import { StyleSheet } from "react-native";

function Published(data: any) {
  return (
    <View theme={{ background: "back2" }} style={styles.container}>
      <MasonryList
        style={styles.container}
        data={data.published ? data.published : []}
        numColumns={1}
        renderItem={({ item }) => <ListingCard data={item} />}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});

export default Published;
