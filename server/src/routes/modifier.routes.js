import express from "express";
import {
  createModifier,
  getModifierById,
  getAllModifiers,
  updateModifier,
//   deleteModifier,
} from "../controllers/modifier.controller.js";
const modifierRoutes = express.Router();

// Create a modifier
modifierRoutes.post('/modifier', createModifier);

// Get a modifier by ID
modifierRoutes.get("/modifier/:id", getModifierById);

// Get all modifiers
modifierRoutes.get("/modifiers", getAllModifiers);

// Update a modifier
modifierRoutes.put("/modifier/:id", updateModifier);

// // Delete a modifier
// modifierRoutes.delete("/modifier/:id", deleteModifier);

// Delete all modifiers
// modifierRoutes.delete("/modifiers", deleteAllModifiers);

export default modifierRoutes; 