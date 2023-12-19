import MyPost from "@components/post/MyPost";
import PostProvider from "@components/post/PostProvider";

function ManagerOrder() {
  return (
    <PostProvider>
      <MyPost />
    </PostProvider>
  );
}

export default ManagerOrder;
