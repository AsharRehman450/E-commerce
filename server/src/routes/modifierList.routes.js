import express from "express";
import {
  createModifierList,
  getAllModifierLists,
  getModifierListById,
  deleteModifierList
} from "../controllers/modifierList.controller.js";

const modifierListRoutes = express.Router();

// Create a modifier list
modifierListRoutes.post('/modifier-list', createModifierList);

// Get all modifier lists
modifierListRoutes.get('/modifier-lists', getAllModifierLists);

// Get modifier list by ID
modifierListRoutes.get('/modifier-list/:id', getModifierListById);

// Delete modifier list
modifierListRoutes.delete('/modifier-list/:id', deleteModifierList);

export default modifierListRoutes; 