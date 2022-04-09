import React, { useContext } from "react";
import { StateContext } from "../../context/StateProvider";
import "./Review.css";

function Review({ review, deleteReview, product }) {
  const [state, dispatch] = useContext(StateContext);

  async function handleClick(e){
    await fetch(`/api/v1/products/${product.id}/reviews/${review.review_id}`, {
      method: "DELETE",
      credentials: "include"
    })

    deleteReview(review.review_id);
  }

  function getDate(isoDate){
    const date = new Date(isoDate);
    let formattedDate = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
    return formattedDate;
  }

  return (<div className="review">
    <p className="user">{review.user_name} <span className="time">{getDate(review.created_at)}</span></p>
    <p className="starability-result" data-rating={review.rating}></p>
    <p className="review_body">Review: {review.review}</p>
    {
      state.user?.id == review.user_id ? 
      <button className="delete_review" onClick={handleClick}>Delete</button> :
      ""
    }
  </div>);
}

export default Review;
