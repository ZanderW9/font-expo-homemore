import PostProvider from "@components/order/OrderProvider";
import MyPost from "@components/post/MyPost";

function ManagerOrder() {
  return (
    <PostProvider>
      <MyPost />
    </PostProvider>
  );
}

export default ManagerOrder;
