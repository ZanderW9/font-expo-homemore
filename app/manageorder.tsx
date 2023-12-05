import MyOrder from "@components/order/MyOrder";
import OrderProvider from "@components/order/OrderProvider";

function ManagerOrder() {
  return (
    <OrderProvider>
      <MyOrder />
    </OrderProvider>
  );
}

export default ManagerOrder;
