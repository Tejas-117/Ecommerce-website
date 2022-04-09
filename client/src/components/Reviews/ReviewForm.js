import React, { useContext, useState } from "react";
import { StateContext } from "../../context/StateProvider";
import "./ReviewForm.css";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../layout/Loader/Loader";

function ReviewForm({ product }) {
  const [state, dispatch] = useContext(StateContext);
  const [message, setMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);

  async function submitReview(e) {
    e.preventDefault();
    setisLoading(true);

    const review = document.getElementById("review");
    const ratingElts = Array.from(document.getElementsByName("rating"));
    let rating;

    ratingElts.forEach((a) => {
      if (a.checked) {
        rating = a.value;
        return;
      }
    });

    if (!state.user) {
      setMessage("Login to add review");
    } 
    else {
      const response = await fetch(
        `/api/v1/products/${product.id}/reviews/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, review: review.value }),
          credentials: "include",
        }
      );

      const data = await response.json();
      setMessage(data.message);
      window.location.reload();
      
    }

    setisLoading(false);
  }

  return (
    <div className="review_form_container" id="review_form_container">
      <h2 style={{ margin: "10px 0" }}>Leave a Review</h2>
      <form className="review_form" onSubmit={submitReview}>
        <fieldset className="starability-basic">
          <legend>Rating:</legend>
          <input
            type="radio"
            id="no-rate"
            className="input-no-rate"
            name="rating"
            value="1"
            defaultChecked={true}
            aria-label="No rating."
          />

          <input type="radio" id="rate1" name="rating" value="1" />
          <label htmlFor="rate1">1 star.</label>

          <input type="radio" id="rate2" name="rating" value="2" />
          <label htmlFor="rate2">2 stars.</label>

          <input type="radio" id="rate3" name="rating" value="3" />
          <label htmlFor="rate3">3 stars.</label>

          <input type="radio" id="rate4" name="rating" value="4" />
          <label htmlFor="rate4">4 stars.</label>

          <input type="radio" id="rate5" name="rating" value="5" />
          <label htmlFor="rate5">5 stars.</label>

          <span className="starability-focus-ring"></span>
        </fieldset>

        <label htmlFor="review">Review: </label>
        <textarea
          name="review"
          id="review"
          cols="30"
          rows="10"
          maxLength={200}
          required
        ></textarea>
        
        <button className="submit_review">Submit Review</button>
      </form>
      <div className="message_container">
        {isLoading && <Loader />}

        {message && (
          <div className="message">
            {message}
            <CloseIcon className="close" onClick={() => setMessage("")} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewForm;
