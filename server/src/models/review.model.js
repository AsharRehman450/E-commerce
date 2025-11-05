import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: String,
      default: 0
    },
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
        ref: "Product",
   },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", reviewSchema);