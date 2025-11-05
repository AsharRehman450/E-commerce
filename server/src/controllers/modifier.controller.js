import { randomUUID } from 'crypto';
import { squareClient } from "../utils/square.config.js";
import { safeSerialize } from '../utils/jsonUtils.js';

const formatPrice = (cents) => {
  if (!cents) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(cents) / 100).replace('$', '');
};

export const createModifier = async (req, res) => {
  try {
    const {
      name,
      price,
      modifierListId,
      ordinal
    } = req.body;

    if (!name || !modifierListId) {
      return res.status(400).json({
        success: false,
        error: "Modifier name and modifier list ID are required"
      });
    }

    // First, get the existing modifier list
    const { result: existingList } = await squareClient.catalogApi.retrieveCatalogObject(modifierListId);

    if (!existingList.object || existingList.object.type !== 'MODIFIER_LIST') {
      return res.status(404).json({
        success: false,
        error: "Modifier list not found"
      });
    }

    // Add the new modifier to the existing modifiers array
    const updatedModifiers = [
      ...(existingList.object.modifierListData.modifiers || []),
      {
        type: 'MODIFIER',
        id: `#${randomUUID()}`,
        modifierData: {
          name,
          priceMoney: price ? {
            amount: parseInt(price),
            currency: 'USD'
          } : undefined,
          ordinal: ordinal || 0
        }
      }
    ];

    // Update the modifier list with the new modifier
    const updatePayload = {
      idempotencyKey: randomUUID(),
      object: {
        type: 'MODIFIER_LIST',
        id: modifierListId,
        version: existingList.object.version,
        modifierListData: {
          ...existingList.object.modifierListData,
          modifiers: updatedModifiers
        }
      }
    };

    const { result } = await squareClient.catalogApi.upsertCatalogObject(updatePayload);

    // Find the newly created modifier in the response
    const newModifier = result.catalogObject.modifierListData.modifiers.slice(-1)[0];

    return res.status(201).json(safeSerialize({
      success: true,
      message: "Modifier created successfully",
      modifier: newModifier
    }));

  } catch (error) {
    console.error('Modifier creation error:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to create modifier",
      details: error.message
    });
  }
};

export const getModifierById = async (req, res) => {
  try {
    const { id } = req.params;

    const { result } = await squareClient.catalogApi.retrieveCatalogObject(id);

    if (!result.object || result.object.type !== 'MODIFIER') {
      return res.status(404).json({
        success: false,
        error: "Modifier not found"
      });
    }

    return res.json(safeSerialize({
      success: true,
      modifier: result.object
    }));
  } catch (error) {
    console.error('Error retrieving modifier:', error);
    return res.status(500).json({
      error: "An error occurred while retrieving the modifier.",
      details: error.message
    });
  }
};

export const getAllModifiers = async (req, res) => {
  try {
    const { result: { objects } } = await squareClient.catalogApi.listCatalog(undefined, 'MODIFIER');

    const modifiers = objects?.map(modifier => ({
      ...modifier,
      modifierData: {
        ...modifier.modifierData,
        priceMoney: modifier.modifierData?.priceMoney ? {
          ...modifier.modifierData.priceMoney,
          formattedAmount: formatPrice(modifier.modifierData.priceMoney.amount)
        } : null
      }
    })) || [];

    return res.json(safeSerialize({
      success: true,
      modifiers
    }));
  } catch (error) {
    console.error('Error retrieving modifiers:', error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while retrieving the modifiers.",
      details: error.message
    });
  }
};

export const updateModifier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      modifierListId,
      ordinal
    } = req.body;

    // First, get the existing modifier
    const { result: existingModifier } = await squareClient.catalogApi.retrieveCatalogObject(id);

    if (!existingModifier.object || existingModifier.object.type !== 'MODIFIER') {
      return res.status(404).json({
        success: false,
        error: "Modifier not found"
      });
    }

    const updatePayload = {
      idempotencyKey: randomUUID(),
      object: {
        type: 'MODIFIER',
        id: id,
        version: Number(existingModifier.object.version),
        presentAtAllLocations: true,
        modifierData: {
          name: name || existingModifier.object.modifierData.name,
          priceMoney: price ? {
            amount: parseInt(price),
            currency: 'USD'
          } : existingModifier.object.modifierData.priceMoney,
          modifierListId: modifierListId || existingModifier.object.modifierData.modifierListId,
          ordinal: ordinal ?? existingModifier.object.modifierData.ordinal
        }
      }
    };

    const { result } = await squareClient.catalogApi.upsertCatalogObject(updatePayload);

    return res.json(safeSerialize({
      success: true,
      message: "Modifier updated successfully",
      modifier: result.catalogObject
    }));

  } catch (error) {
    console.error('Error updating modifier:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to update modifier",
      details: error.message
    });
  }
}; 