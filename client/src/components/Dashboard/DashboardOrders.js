import ReactDOM from "react-dom";
import { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import "./DashboardOrders.css";
import { formatDate } from "../../utils/FormatDate";
import DashboardOrderProducts from "./DashboardOrderProducts";

// two possible scenario to display image - cancelling order, and fulfilling order.

function DashboardOrders({ allOrders, setMessage, resetMessage }) {
  const [orders, setOrders]  = useState(allOrders);

  // toggle order items details
  async function toggleDetails(e, order_id) {
    const dashboardOrderWrapper = e.target.closest(".dashboard_order_wrapper");
    const orderProducts = dashboardOrderWrapper.querySelector(".dashboard_order_products");
    orderProducts.classList.toggle("show_dashboard_order_products");

    // fetches data on first toggle
    if (orderProducts.children.length === 0) {
      const data = await getOrderById(order_id);
      const order = orders.find((order) => order.id === order_id);

      ReactDOM.render(
        <DashboardOrderProducts
          orderId={order_id}
          products={data.order}
          deliveryStatus={order.delivery_status}
          currency={order.currency}
          setMessage={setMessage}
          resetMessage={resetMessage}
        />,
        orderProducts
      );
    }
  }

  // get information of a order
  async function getOrderById(order_id) {
    const response = await fetch(`/api/v1/orders/${order_id}`);
    const { data, error } = await response.json();

    if (!error) return data;
  }

  // cancel order
  async function cancelOrder(e, order_id) {
    const response = await fetch(`/api/v1/orders/${order_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const { data, error } = await response.json();
   
    if(error){
      setMessage("Order couldn't be cancelled");
      resetMessage();
    }
    else{
      const deletedOrderIdx = orders.findIndex((order) => order.id === order_id);
      orders.splice(deletedOrderIdx, 1);
      setOrders([...orders]);
  
      setMessage(data.message);
      resetMessage();
    }
  }

  const bgGreen = { backgroundColor: "green" };
  const bgRed = { backgroundColor: "red" };

  return (
    <div className="dashboard_orders_container">
      {orders.map((order) => (
        <div className="dashboard_order_wrapper" key={order.id}>
          <div className="dashboard_order_details">
            <p>
              ORDER # <span>{order.id}</span>
            </p>
            <p>
              ORDER PLACED <span>{formatDate(order.created_at)}</span>
            </p>
            <p>
              USER # <span>{order.user_id}</span>
            </p>
            <p>
              PAYMENT STATUS
              <span
                className="payment_status"
                style={order.payment_status === "paid" ? bgGreen : bgRed}
              >
                {order.payment_status}
              </span>
            </p>
            <p>
              PRICE <span>{order.price + " " + (order.currency || "")}</span>
            </p>
            <p>
              DELIVERY STATUS
              <span>{order.delivery_status || "pending payment"}</span>
            </p>
            <p>
              <button onClick={(e) => toggleDetails(e, order.id)}>
                View <RemoveRedEyeIcon className="order_button_icons" />
              </button>
              {order.payment_status !== "paid" ? (
                <>
                  <button onClick={(e) => cancelOrder(e, order.id)}>
                    Cancel <CancelIcon className="order_button_icons" />
                  </button>
                </>
              ) : (
                ""
              )}
            </p>
          </div>

          <div className="dashboard_order_products"></div>
        </div>
      ))}
    </div>
  );
}

export default DashboardOrders;
