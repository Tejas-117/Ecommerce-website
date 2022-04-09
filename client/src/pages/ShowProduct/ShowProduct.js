import React, { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ShowProduct.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { StateContext } from "../../context/StateProvider";
import ReviewForm from "../../components/Reviews/ReviewForm";
import Review from "../../components/Reviews/Review";
import Loader from "../../components/layout/Loader/Loader";

function ShowProduct() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useContext(StateContext);

  useEffect(() => {
    setisLoading(true);

    async function getProduct() {
      const response = await fetch(`/api/v1/products/${productId}`);
      const { data, error } = await response.json();

      setProduct(data);
      setisLoading(false);
      setThumbnail(data.images[0]);
    }

    getProduct();
  }, []);

  function changeThumbnail(e) {
    const { id } = e.target.dataset;

    product.images.forEach((image) => {
      if (id == image.image_id) {
        setThumbnail(image);
      }
    });
  }

  function updateQuantity(type) {
    if (type === "increase") {
      if (quantity <= product.stock) setQuantity(quantity + 1);
    } else {
      if (quantity > 1) setQuantity(quantity - 1);
    }
  }

  function addToCart(e) {
    product.image = thumbnail.image_url;
    dispatch({ type: "add_to_cart", payload: { item: product, quantity } });
  }

  function deleteReview(review_id) {
    const reviews = product.reviews;

    const idx = reviews.findIndex((review) => review.review_id === review_id);
    reviews.splice(idx, 1);

    const newProduct = { ...product, reviews };
    setProduct(newProduct);
  }

  return (
    <Fragment>
      {isLoading || !Object.keys(product).length ? (
        <div className="load">
          <Loader /> <p>Fetching Data</p>
        </div>
      ) : (
        <>
          <div className="product_container">
            <div className="images_container">
              <div
                className="thumbnail"
                style={{ backgroundImage: `url(${thumbnail.image_url})` }}
              ></div>
              <div className="images">
                {product.images.map((image) => (
                  <img
                    src={image.image_url.toString()}
                    className="product_image"
                    key={image.image_id}
                    data-id={image.image_id}
                    onClick={changeThumbnail}
                  />
                ))}
              </div>
            </div>

            <div className="info_container">
              <h1>{product.name}</h1>
              <p>{product.description + product.description}</p>
              <span className="product_price">₹{product.price}</span>

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
                <button onClick={addToCart}>
                  Add To Cart <ShoppingCartIcon />{" "}
                </button>
              </div>
            </div>
          </div>

          <h1 className="reviews_heading">Reviews</h1>
          <div className="review_container">
            <ReviewForm product={product} />

            <div className="all_reviews">
              {product.reviews ? (
                product.reviews.map((review, idx) => {
                  return (
                    <Review
                      deleteReview={deleteReview}
                      review={review}
                      product={product}
                      key={review.review_id}
                    />
                  );
                })
              ) : (
                <h2 style={{ textAlign: "center", width: "100%" }}>
                  No reviews
                </h2>
              )}
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
}

export default ShowProduct;
