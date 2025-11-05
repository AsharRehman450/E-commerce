import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
   title: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: String,
    default: 0
  },
 price: { type: String },
    unit: {
      type: String,
      default: "$",
    },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
      },
}, {
  timestamps: true
});

export const Category = mongoose.model("Category", categorySchema);