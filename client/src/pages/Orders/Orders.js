import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import "./Orders.css";
import OrderProduct from "../../components/Order/OrderProduct";
import { StateContext } from "../../context/StateProvider";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PaidIcon from '@mui/icons-material/Paid';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate } from "../../utils/FormatDate";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();

  // get all orders of a user
  async function getAllOrders() {
    const response = await fetch(`/api/v1/orders/`, { credentials: "include" });
    const { data, error } = await response.json();
    setOrders(data.orders);
  }

  // get order info by its id
  async function getOrderById(order_id){
    const response = await fetch(`/api/v1/orders/${order_id}`);
    const { data, error } = await response.json();
    
    if(!error) return data;
  }
  
  // toggle order details
  async function toggleDetails(e, order_id){
    const orderWrapper = e.target.closest('.order_wrapper');
    const orderProducts = orderWrapper.querySelector('.order_products');
    orderProducts.classList.toggle('show_order_products');

    // fetches data on first click
    if(orderProducts.children.length === 0){
      const data = await getOrderById(order_id);
      const order = (orders.find((order) => order.id === order_id));

      ReactDOM.render(<OrderProduct products={data.order} paymentStatus={order.payment_status} currency={order.currency} />, orderProducts);
    }
  }

  // pay for unpaid orders
  async function payForOrder(e, order){
    // set order id to be referenced later on payment success;
    dispatch({ type: "update_order_info", payload: { order_info: { order_id: order.id } } });

    // set shipping info for creating payment_intent;
    const shipping = {
      address: order.address,
      city: order.city,
      state: order.state,
      country: order.country,
      phone: order.phone,
      pinCode: order.postal_code
    };
    dispatch({ type: "update_shipping_info", payload: { shipping } });
    navigate("/payment");
  }

  // cancel a unpaid order
  async function cancelOrder(e, order){
    const response = await fetch(`/api/v1/orders/${order.id}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await response.json();
    window.location.reload();
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  const bgGreen = { backgroundColor: "green" };
  const bgRed = { backgroundColor: "red" };

  return (
    <div className="orders_container">
      <h1>Your orders</h1>

      {orders &&
        orders.map((order) => (
          <div className="order_wrapper" key={order.id}>
            <div className="order_details">
              <p>ORDER PLACED <span>{formatDate(order.created_at)}</span></p>
              <p>TOTAL <span>{order.currency + ' ' + order.price}</span></p>
              <p>PAYMENT STATUS
                <span className="payment_status" style={order.payment_status === "paid" ? bgGreen : bgRed}>
                  {order.payment_status}
                </span>
              </p>
              <p>ORDER # <span>{order.id}</span></p>
              <p>
              <button onClick={(e) => toggleDetails(e, order.id)}>View <RemoveRedEyeIcon className="order_button_icons" /></button> 
              {
                  (order.payment_status !== 'paid') ? 
                   <>
                    <button onClick={(e) => payForOrder(e, order)}>Pay <PaidIcon className="order_button_icons" /></button> 
                    <button onClick={(e) => cancelOrder(e, order)}>Cancel <CancelIcon className="order_button_icons" /></button>
                   </>
                    : ""
              }
              </p>
            </div>

            <div className="order_products"></div>
          </div>
        ))}
    </div>
  );
}

export default Orders;
