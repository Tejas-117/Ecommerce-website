const router = require("express").Router({ mergeParams: true });

// Util functions
const { uploadImages } = require("../utils/uploadFiles");

// util functions for authentication
const { isLoggedIn, isAdmin } = require("../utils/auth");

// controllers
const { getAllProducts, getProduct, addProduct, editProduct, deleteProduct } = require("../controllers/products");

// GET all products
router.get("/", getAllProducts);

// GET single product
router.get("/:id", getProduct);

////////////////////// ADMIN functionalities  //////////////////////////

// ADD a product
router.post("/", isAdmin, uploadImages, addProduct);

// EDIT a product
router.put("/:id", isAdmin, uploadImages, editProduct);

// DELETE a product
router.delete("/:id", isAdmin, deleteProduct);

module.exports = router;
