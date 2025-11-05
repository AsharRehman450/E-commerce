import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    photo: [String],
    price: { type: String },
    unit: {
      type: String,
      default: "$",
    },
     discount: {
      type: Number,
      default: true,
    },
     color: {
      type: [String],
      default: [],
    },

    size: {
      type: [String],
      default: [],
    },
    rating: {
    type: String,
    default: 0
  },
    sold: {
    type: Number,
    default: 0,
  },
  isNewArrival: {
  type: Boolean,
  default: false,
},
isTopSelling: {
  type: Boolean,
  default: false,
},


    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  {
    timestamps: true,
  }
);

export const Product = mongoose.model("product", productSchema);