import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Product.css";
import { StateContext } from "../../context/StateProvider";


function Product({ product }) {
  const [state, dispatch] = useContext(StateContext);

  function handleClick(e){
    e.preventDefault();

    const item = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image_url,
      price: product.price,
      stock: product.stock
    }

    dispatch({ type:"add_to_cart", payload: { item, quantity: 1 }  })
  }

  return (
    <Link to={`/products/${product.id}`}>
    <div className="product">
      <div className="image_container" style={{ backgroundImage: `url(${product.image_url})` }}>
      </div>
      <span className="category">{product.category}</span>
      <h3 className="name">{product.name}</h3>
      <div className="info">
        <div>
          <span className="price">₹{product.price} </span>
        </div>
        <button className="add_to_cart" onClick={handleClick}>Add To Cart</button>
      </div>
    </div>
    </Link>
  );
}

export default Product;
