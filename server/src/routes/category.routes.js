// src/routes/category.routes.js
import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post('/category', createCategory);           
router.get('/category', getAllCategories);          
router.get('/category/:id', getCategoryById);     
router.put('/category/:id', updateCategory);        
router.delete('/category/:id', deleteCategory);  

export default router;