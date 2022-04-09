const router = require("express").Router({ mergeParams: true });
const { isLoggedIn, isAdmin } = require("../utils/auth");

// controller
const { register, authenticate, logout, login, getAllUsers,  changeRole } = require("../controllers/users");

// Get all users
router.get("/", isAdmin, getAllUsers);

// Register a user
router.post("/register", register);

// Authenticate a user
router.get("/login", isLoggedIn, authenticate);

// Login a user
router.post("/login", login);

// Logout a user
router.post("/logout", logout);

// Change role of a user
router.patch("/user-roles/:userID", isAdmin, changeRole);

module.exports = router;
