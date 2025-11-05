// import { Review } from "../models/review.model.js";

// // ✅ Get all reviews
// export const getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, reviews });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Failed to fetch reviews" });
//   }
// };

// // ✅ Create a new review
// export const createReview = async (req, res) => {
//   try {
//     const { customerName, comment, rating, photo } = req.body;

//     const newReview = new Review({
//       customerName,
//       comment,
//       rating,
//       photo,
//     });

//     await newReview.save();

//     res.status(201).json({ success: true, review: newReview });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Failed to create review" });
//   }
// };

// export const getProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching product reviews" });
//   }
// };

// // ✅ Update a review
// export const updateReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { customerName, comment, rating, photo } = req.body;

//     const updatedReview = await Review.findByIdAndUpdate(
//       id,
//       { customerName, comment, rating, photo },
//       { new: true }
//     );

//     if (!updatedReview) {
//       return res.status(404).json({ success: false, error: "Review not found" });
//     }

//     res.status(200).json({ success: true, review: updatedReview });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Failed to update review" });
//   }
// };

// // ✅ Delete a review
// export const deleteReview = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedReview = await Review.findByIdAndDelete(id);

//     if (!deletedReview) {
//       return res.status(404).json({ success: false, error: "Review not found" });
//     }

//     res.status(200).json({ success: true, message: "Review deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Failed to delete review" });
//   }
// };


import { Review } from "../models/review.model.js";

// ✅ Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;       // page number (default 1)
    const limit = parseInt(req.query.limit) || 5;     // items per page (default 5)
    const skip = (page - 1) * limit;

    // Get reviews for current page
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total number of reviews
    const total = await Review.countDocuments();

    res.status(200).json({
      success: true,
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
};

// ✅ Create a new review
export const createReview = async (req, res) => {
  try {
    const data = req.body;

    // Check if it's an array of reviews
    if (Array.isArray(data)) {
      const createdReviews = await Review.insertMany(data);
      return res.status(201).json({ message: "Multiple reviews created", reviews: createdReviews });
    }

    // Single review case
    const review = new Review(data);
    await review.save();
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};


// ✅ Get reviews for a specific product

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product reviews" });
  }
};


// ✅ Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, comment, rating, photo } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { customerName, comment, rating, photo },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update review" });
  }
};

// ✅ Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete review" });
  }
};