import express from "express";
import {
  getAllReviews,
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const reviewRoutes = express.Router();

// GET all reviews (for admin maybe)
reviewRoutes.get("/review", getAllReviews);

// ✅ GET reviews for specific product (fix this route)
reviewRoutes.get("/review/product/:productId", getProductReviews);

// POST new review
reviewRoutes.post("/review", createReview);

// PUT update review
reviewRoutes.put("/review/:id", updateReview);

// DELETE review
reviewRoutes.delete("/review/:id", deleteReview);

export default reviewRoutes;




