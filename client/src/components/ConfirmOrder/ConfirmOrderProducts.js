import React from "react";
import "./ConfirmOrderProducts.css";

function ConfirmOrderProducts({ product }) {
  return (
    <div className="confirm_order_product">
       <h4>{product.name}</h4>
       <img src={product.image} alt="product image" />
       <p>Quantity: <span>{product.quantity}</span></p>
       <p>Total:  <span>₹{(product.quantity * product.price).toFixed(3)} </span></p>
   </div>
  );
}

export default ConfirmOrderProducts;
