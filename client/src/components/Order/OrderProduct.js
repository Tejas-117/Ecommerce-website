import React, { Fragment } from "react";
import "./OrderProduct.css";

function OrderProduct({ products, paymentStatus, currency }) {
  return (
    <Fragment>
      {
        (products.length === 0) && <h3>Products Not Found </h3>
      }

      {products?.map((product, idx) => (
        <div className="order_product" key={idx}>
          <div className="order_product_image_container">
            <img src={product.image_url} alt="product images" />
          </div>

          <div>
            <h4>{product.name}</h4>
            <p>Quantity: <span>{product.quantity}</span></p>
            <p>Subtotal: <span>{currency + ' ' + product.subtotal}</span></p>
          </div>
        </div>
      ))}            
    </Fragment>
  );
}

export default OrderProduct;
