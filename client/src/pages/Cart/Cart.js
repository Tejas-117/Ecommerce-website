import React, { useContext, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { StateContext } from "../../context/StateProvider";
import CartProduct from "../../components/Cart/CartProduct";

function Checkout() {
  const [state, dispatch] = useContext(StateContext);

  function getCartTotal() {
    let total = 0;

    state.cart.forEach((item) => {
      total += item.quantity * item.price;
    });

    return total;
  }

  return (
    <div className="cart_container">
        {
          state.cart.length === 0 ? (
            <h1 className="cart_message">No items in cart!!</h1>
          ) : (
            <h1 className="cart_message">Items in cart</h1>
        )}

      <div className="cart_product_container">
        {state.cart.map((product) => (
          <CartProduct product={product} key={product.id} />
        ))}
      </div>

      <div className="cart_info">
        <span> Total items in cart: {state.cart.length}</span>
        <span>
          Total Price:
          <span className="price">₹{getCartTotal().toFixed(2)}</span>
        </span>
        <Link to={`/shipping`}>
          <button disabled={!state.cart.length}>Proceed To Checkout</button>
        </Link>
      </div>
    </div>
  );
}

export default Checkout;
