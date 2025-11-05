import { randomUUID } from 'crypto';
import { squareClient } from "../utils/square.config.js";
import { safeSerialize } from '../utils/jsonUtils.js';

export const createModifierList = async (req, res) => {
  try {
    const {
      name,
      selectionType = 'SINGLE',
      modifiers = [], // Array of initial modifiers
      maxSelections = 1,
      minSelections = 0,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Modifier list name is required"
      });
    }

    // Create at least one modifier if none provided
    const initialModifiers = modifiers.length > 0 ? modifiers : [{
      name: "Regular",
      price: 0
    }];

    const modifierListId = `#${randomUUID()}`;

    const squareModifierList = {
      idempotencyKey: randomUUID(),
      object: {
        type: 'MODIFIER_LIST',
        id: modifierListId,
        presentAtAllLocations: true,
        modifierListData: {
          name,
          selectionType,
          modifiers: initialModifiers.map(mod => ({
            type: 'MODIFIER',
            id: `#${randomUUID()}`,
            modifierData: {
              name: mod.name,
              priceMoney: {
                amount: parseInt(mod.price),
                currency: 'USD'
              },
              ordinal: mod.ordinal || 0
            }
          }))
        }
      }
    };

    console.log('Creating modifier list with payload:', JSON.stringify(squareModifierList, null, 2));

    const { result } = await squareClient.catalogApi.upsertCatalogObject(squareModifierList);

    return res.status(201).json(safeSerialize({
      success: true,
      message: "Modifier list created successfully",
      modifierList: result.catalogObject
    }));

  } catch (error) {
    console.error('Modifier list creation error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to create modifier list",
      details: error.message
    });
  }
};

export const getAllModifierLists = async (req, res) => {
  try {
    const { result: { objects } } = await squareClient.catalogApi.listCatalog(undefined, 'MODIFIER_LIST');

    return res.json(safeSerialize({
      success: true,
      modifierLists: objects || []
    }));
  } catch (error) {
    console.error('Error retrieving modifier lists:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve modifier lists",
      details: error.message
    });
  }
};

export const getModifierListById = async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(id);

    if (!result.object || result.object.type !== 'MODIFIER_LIST') {
      return res.status(404).json({
        success: false,
        error: "Modifier list not found"
      });
    }

    return res.json(safeSerialize({
      success: true,
      modifierList: result.object
    }));
  } catch (error) {
    console.error('Error retrieving modifier list:', error);
    return res.status(500).json({
      error: "Failed to retrieve modifier list",
      details: error.message
    });
  }
};

export const deleteModifierList = async (req, res) => {
  try {
    const { id } = req.params;
    await squareClient.catalogApi.deleteCatalogObject(id);

    return res.json({
      success: true,
      message: "Modifier list deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting modifier list:', error);
    return res.status(500).json({
      error: "Failed to delete modifier list",
      details: error.message
    });
  }
}; 