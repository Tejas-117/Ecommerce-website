import React, { useContext, useEffect, useState } from "react";
import "./CartProduct.css";
import { StateContext } from "../../context/StateProvider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function CartProduct({ product }) {
  const [state, dispatch] = useContext(StateContext);
  const [quantity, setQuantity] = useState(product.quantity);

  function updateQuantity(type) {
    if (type === "increase") {
      if(quantity < product.stock) setQuantity(quantity + 1);
    } 
    else {
      if (quantity > 1) setQuantity(quantity - 1);
    }
  }

  useEffect(() => {
    const item = { id: product.id };
    const diffInQuantity = product.quantity - quantity;
    
    dispatch({ 
      type: "add_to_cart",
      payload: { item, quantity: -1 * (diffInQuantity) } 
    });
  }, [quantity])
  
  function removeFromCart(){
    dispatch({
      type: "remove_from_cart",
      payload: { item: product }
    })
  }

  return (
    <div className="cart_product">
      <div
        className="cart_product_image"
        style={{ backgroundImage: `url(${product.image})` }}
      ></div>

      <div className="cart_product_info">
        <h3>{product.name}</h3>

        <div>
          <span className="quantity">
            <RemoveIcon
              className="icons"
              onClick={(e) => updateQuantity("decrease")}
            />
            {quantity}
            <AddIcon
              className="icons"
              onClick={(e) => updateQuantity("increase")}
            />
          </span>
        </div>

        <span className="price">₹{(quantity * product.price).toFixed(2)}</span>
        <button onClick={removeFromCart}>Remove From Cart</button>
      </div>
    </div>
  );
}

export default CartProduct;
