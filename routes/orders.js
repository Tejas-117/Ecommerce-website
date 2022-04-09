const router = require("express").Router({ mergeParams: true });

// util functions
const { isLoggedIn, isAdmin } = require("../utils/auth");

// controllers
const { createOrder, updatePaymentStatus, getOrderById, deleteOrderById, getAllOrdersOfUser, getAllOrders, fulfillOrder } = require("../controllers/orders");

// Get all new orders (payment complete)
router.get("/new",  getAllOrders)

// Get all orders of a user
router.get("/", isLoggedIn, getAllOrdersOfUser);

// Create a new order of a user 
router.post("/", isLoggedIn, createOrder);

// Update payment status of a order
router.patch("/update-payment-status/:orderID", isLoggedIn, updatePaymentStatus);

// Fulfill order
router.patch("/fulfill-order/:orderID", isAdmin, fulfillOrder);

// Get a order by its ID
router.get("/:orderID", isLoggedIn, getOrderById);

// Delete a order
router.delete("/:orderID", isLoggedIn, deleteOrderById);

module.exports = router;