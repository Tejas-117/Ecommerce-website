const router = require("express").Router({ mergeParams: true });

// utils
const { isLoggedIn } = require("../utils/auth");
const { calculateAmount } = require("../utils/otherUtils");

// controller
const { getPublishableKey, createPaymentIntent } = require("../controllers/payment");

// get client side publishable key
router.get("/publishable-key", getPublishableKey)
 
// create payment intent
router.post("/create-payment-intent", isLoggedIn, createPaymentIntent)

module.exports = router;