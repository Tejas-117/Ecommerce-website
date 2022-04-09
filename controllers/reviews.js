const db = require("../config/db-config");
const { newHttpError } = require("../utils/error");

const addReview = async (req, res, next) => {
  const { id: product_id } = req.params;
  const { rating, review } = req.body;

  try {
    const user_id = req.session.user.id;
    const x = await db.query(
      `INSERT INTO reviews (product_id, user_id,rating, review)
        VALUES ($1, $2, $3, $4); `,
      [product_id, user_id, rating, review]
    );

    return res.status(200).json({ message: "Review added" });
  }
   catch (error) {
    return next(newHttpError(500, error.message));
   }
};

const deleteReview = async (req, res, next) => {
  const { id } = req.params;
  const { reviewId } = req.params;

  try {
    const user_id = req.session.user.id;
    const result = await db.query(
      `DELETE FROM reviews WHERE id = $1 AND user_id = ${user_id}`,
      [reviewId]
    );

    // if the user_id of review doesn't match with the one logged in
    if (!result.rowCount) {
      return res.json({ message: "Unable to delete a review" });
    }

    return res.status(200).json({ message: "Review Deleted" });
  } 
  catch (error) {
    return next(newHttpError(500, error.message))
  }
};

module.exports = {
  addReview,
  deleteReview,
};
