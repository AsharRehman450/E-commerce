import { Product } from "../models/product.model.js";
import { safeSerialize } from '../utils/jsonUtils.js';
import {Category} from "../models/category.model.js"

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create product",
      details: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while retrieving the product",
      details: error.message,
    });
  }
};

// export const getAllProducts = async (req, res) => {
//   try {
//     const {
//       category,
//       size,
//       color,
//       minPrice,
//       maxPrice,
//       page = 1,
//       limit = 12,
//       sort = "createdAt",
//       order = "desc",
//     } = req.query;

//     let filter = {};

//     // ✅ Category filter (by name)
//     if (category) {
//       const categories = await Category.find({
//         name: { $regex: new RegExp(category, "i") },
//       });
//       const categoryIds = categories.map((cat) => cat._id);
//       if (categoryIds.length > 0) {
//         filter.category = { $in: categoryIds };
//       }
//     }

//     // ✅ Price range filter
//     if (minPrice && maxPrice) {
//       filter.price = {
//         $gte: parseFloat(minPrice),
//         $lte: parseFloat(maxPrice),
//       };
//     }

//     // ✅ Size filter
//     if (size) {
//       filter.size = size;
//     }

//     // ✅ Color filter
//     if (color) {
//       filter.color = color;
//     }

//     const skip = (page - 1) * limit;

//     const total = await Product.countDocuments(filter);

//     const products = await Product.find(filter)
//       .populate("category")
//       .sort({ [sort]: order === "asc" ? 1 : -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     return res.status(200).json({
//       success: true,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       products,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: "Failed to retrieve products",
//       details: error.message,
//     });
//   }
// };

 export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      size,
      color,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = "createdAt",
      order = "desc",
      search, // ✅ add this
    } = req.query;

    let filter = {};

    // ✅ Live Search Logic
    if (search) {
      filter.title = { $regex: new RegExp(search, "i") };
    }

    // ✅ Category filter
    if (category) {
      const categories = await Category.find({
        name: { $regex: new RegExp(category, "i") },
      });
      const categoryIds = categories.map((cat) => cat._id);
      if (categoryIds.length > 0) {
        filter.category = { $in: categoryIds };
      }
    }

    // ✅ Price filter
    if (minPrice && maxPrice) {
      filter.price = {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      };
    }

    if (size) filter.size = size;
    if (color) filter.color = color;

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category")
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve products",
      details: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update product",
      details: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete product",
      details: error.message,
    });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All products deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all products:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete all products",
      details: error.message,
    });
  }
};

// export const getNewArrivals = async (req, res) => {
//   try {
//     const products = await Product.find({})
//       .sort({ createdAt: -1 })
//       .limit(4)
//       .populate("category");

//     return res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     console.error("Error getting new arrivals:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch new arrivals",
//       details: error.message,
//     });
//   }
// };

export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category");

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error getting new arrivals:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch new arrivals",
      details: error.message,
    });
  }
};



export const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTopSelling: true })
      .sort({ sold: -1 })
      .limit(4)
      .populate("category");

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error getting top selling products:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch top selling products",
      details: error.message,
    });
  }
};