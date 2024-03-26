import { Text, View } from "@components/Themed";
import {
  Link,
  Stack,
  useLocalSearchParams,
  usePathname,
  useRouter,
  useFocusEffect,
} from "expo-router";
import { StyleSheet } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();

  useFocusEffect(() => {
    if (pathname && pathname.startsWith("/open-in-app")) {
      const path = pathname.replace("/open-in-app", "");
      delete params.missing;
      router.replace({
        pathname: path,
        params,
      });
    } else {
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  });

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
