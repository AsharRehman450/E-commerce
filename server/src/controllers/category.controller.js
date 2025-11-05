import { randomUUID } from "crypto";
import { squareClient } from "../utils/square.config.js";
import { safeSerialize } from "../utils/jsonUtils.js";
import { ImageUploader, upload } from "../utils/image-upload.js";
import { Category } from "../models/category.model.js";


export const createCategory = async (req, res) => {
  try {
    const { name, title, rating, price, description, isActive } = req.body;

    const newCategory = new Category({ name, title, rating, price, description, isActive });
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: savedCategory,
    });
  } catch (error) {
    console.error("Category creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create category",
      details: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch categories",
      details: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    return res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch category",
      details: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    return res.json({
      success: true,
      message: "Category updated successfully",
      category: updated,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update category",
      details: error.message,
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete category",
      details: error.message,
    });
  }
};