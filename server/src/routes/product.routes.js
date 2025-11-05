import express from "express";
import {
  getNewArrivals,
  getTopSellingProducts,
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  // createMultipleProducts,
} from "../controllers/product.controller.js";
import { upload } from "../utils/image-upload.js";
const productRoutes = express.Router();


// New arrivals route
productRoutes.get("/products/new-arrivals", getNewArrivals);

//getTopSellingProducts
productRoutes.get("/products/top-selling", getTopSellingProducts);

// Create a product
productRoutes.post('/product', createProduct);

// Get a product by ID
productRoutes.get("/product/:id", getProductById);

// Get all products
productRoutes.get("/products", getAllProducts);

// Update a product
productRoutes.put("/product/:id", updateProduct);

// Delete a product
productRoutes.delete("/product/:id", deleteProduct);

// Delete all products
productRoutes.delete("/product", deleteAllProducts);


// // Delete a product
// productRoutes.post("/multiple/product", createMultipleProducts);

export default productRoutes;