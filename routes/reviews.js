const router = require("express").Router({ mergeParams: true });
const { isLoggedIn } = require("../utils/auth");

// controller
const { addReview, deleteReview } = require("../controllers/reviews");

// ADD a review
router.post("/", isLoggedIn, addReview);

// DELETE a review
router.delete("/:reviewId", isLoggedIn, deleteReview);

module.exports = router;