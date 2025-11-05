import { safeSerialize } from "../utils/jsonUtils.js";
import { squareClient } from "../utils/square.config.js";
import { randomUUID } from 'crypto';

// Helper function to serialize BigInt
const serializeBigInt = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

// Get all discounts
export const getAllDiscounts = async (req, res) => {
  try {
    const { result } = await squareClient.catalogApi.listCatalog(undefined, 'DISCOUNT');
    const serializedResult = serializeBigInt(result);

    return res.json({
      success: true,
      discounts: serializedResult.objects || []
    });

  } catch (error) {
    console.error('Error fetching discounts:', error);
    const serializedError = typeof error.errors?.[0]?.detail === 'bigint' 
      ? error.errors[0].detail.toString() 
      : error.errors?.[0]?.detail || error.message;

    return res.status(500).json({
      success: false,
      error: "Failed to fetch discounts",
      details: serializedError
    });
  }
};

// Get discount by ID
export const getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(id);
    const serializedResult = serializeBigInt(result);

    return res.json({
      success: true,
      discount: serializedResult.object
    });

  } catch (error) {
    console.error('Error fetching discount:', error);
    
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        error: "Discount not found"
      });
    }

    const serializedError = typeof error.errors?.[0]?.detail === 'bigint' 
      ? error.errors[0].detail.toString() 
      : error.errors?.[0]?.detail || error.message;

    return res.status(500).json({
      success: false,
      error: "Failed to fetch discount",
      details: serializedError
    });
  }
};

// Create discount
export const createDiscount = async (req, res) => {
    try {
        const {
            name,
            type = 'FIXED_PERCENTAGE',
            percentage,
            amount,
            labelColor = 'FF0000',
            isAutomaticDiscount = false,
            discountRules = {
                type: 'ITEM_OR_CATEGORY',
                items: [],
                categories: [],
                quantityRules: {
                    minimumQuantity: undefined,
                    maximumQuantity: undefined
                }
            }
        } = req.body;

        // Helper function to serialize BigInt
        const serializeBigInt = (obj) => {
            return JSON.parse(JSON.stringify(obj, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        };

        if (isAutomaticDiscount) {
            const discountId = `#${randomUUID()}`;
            const productSetId = `#${randomUUID()}`;
            const pricingRuleId = `#${randomUUID()}`;

            const batchRequest = {
                idempotencyKey: randomUUID(),
                batches: [
                    {
                        objects: [
                            // Discount object
                            {
                                type: 'DISCOUNT',
                                id: discountId,
                                discountData: {
                                    name,
                                    discountType: type,
                                    percentage: percentage?.toString(),
                                    labelColor
                                }
                            },
                            // Product Set object
                            {
                                type: 'PRODUCT_SET',
                                id: productSetId,
                                productSetData: {
                                    name: `${name} Product Set`,
                                    productIdsAny: [
                                        ...(discountRules.items || []),
                                        ...(discountRules.categories || [])
                                    ]
                                }
                            },
                            // Pricing Rule object
                            {
                                type: 'PRICING_RULE',
                                id: pricingRuleId,
                                pricingRuleData: {
                                    name: `${name} Pricing Rule`,
                                    discountId: discountId,
                                    matchProductsId: productSetId,
                                    applicationMode: 'AUTOMATIC'
                                }
                            }
                        ]
                    }
                ]
            };

            // Clean up undefined values
            const cleanedRequest = JSON.parse(JSON.stringify(batchRequest));

            console.log('Batch request:', JSON.stringify(cleanedRequest, null, 2));

            const { result } = await squareClient.catalogApi.batchUpsertCatalogObjects(cleanedRequest);

            // Serialize the response to handle BigInt
            const serializedResult = serializeBigInt(result);

            return res.status(201).json({
                success: true,
                message: "Automatic discount created successfully",
                discount: serializedResult.objects[0],
                productSet: serializedResult.objects[1],
                pricingRule: serializedResult.objects[2]
            });
        }

        // For non-automatic discounts
        const discountData = {
            idempotencyKey: randomUUID(),
            object: {
                type: 'DISCOUNT',
                id: `#${randomUUID()}`,
                discountData: {
                    name,
                    discountType: type,
                    percentage: percentage?.toString(),
                    labelColor
                }
            }
        };

        const cleanedDiscountData = JSON.parse(JSON.stringify(discountData));
        const { result } = await squareClient.catalogApi.upsertCatalogObject(cleanedDiscountData);
        const serializedResult = serializeBigInt(result);

        return res.status(201).json({
            success: true,
            message: "Discount created successfully",
            discount: serializedResult.catalogObject
        });

    } catch (error) {
        console.error('Error creating discount:', error);

        // Serialize error details if they contain BigInt
        const serializedError = typeof error.errors?.[0]?.detail === 'bigint'
            ? error.errors[0].detail.toString()
            : error.errors?.[0]?.detail || error.message;

        return res.status(500).json({
            success: false,
            error: "Failed to create discount",
            details: serializedError
        });
    }
};

// Update discount
export const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            percentage,
            amount,
            type,
            labelColor,
            pinRequired,
            modifyTaxBasis
        } = req.body;

        // First get the existing discount
        const { result: existingDiscountResult } = await squareClient.catalogApi.retrieveCatalogObject(id);
        const existingDiscount = serializeBigInt(existingDiscountResult);

        // Build update payload
        const updateData = {
            idempotencyKey: randomUUID(),
            object: {
                type: 'DISCOUNT',
                id: id,
                version: existingDiscount.object.version,
                discountData: {
                    name: name || existingDiscount.object.discountData.name,
                    discountType: type || existingDiscount.object.discountData.discountType,
                    percentage: type === 'FIXED_PERCENTAGE' ? 
                        percentage?.toString() : 
                        existingDiscount.object.discountData.percentage,
                    amountMoney: type === 'FIXED_AMOUNT' ? {
                        amount: parseInt((amount * 100).toString(), 10),
                        currency: 'USD'
                    } : existingDiscount.object.discountData.amountMoney,
                    pinRequired: pinRequired ?? existingDiscount.object.discountData.pinRequired,
                    labelColor: labelColor || existingDiscount.object.discountData.labelColor,
                    modifyTaxBasis: modifyTaxBasis || existingDiscount.object.discountData.modifyTaxBasis
                }
            }
        };

        // Clean up undefined values
        const cleanedUpdateData = JSON.parse(JSON.stringify(updateData));
        console.log('Update payload:', JSON.stringify(cleanedUpdateData, null, 2));

        const { result } = await squareClient.catalogApi.upsertCatalogObject(cleanedUpdateData);
        const serializedResult = serializeBigInt(result);

        return res.json({
            success: true,
            message: "Discount updated successfully",
            discount: serializedResult.catalogObject
        });

    } catch (error) {
        console.error('Error updating discount:', error);
        
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                error: "Discount not found"
            });
        }

        const serializedError = typeof error.errors?.[0]?.detail === 'bigint' 
            ? error.errors[0].detail.toString() 
            : error.errors?.[0]?.detail || error.message;

        return res.status(500).json({
            success: false,
            error: "Failed to update discount",
            details: serializedError
        });
    }
};

// Delete discount
export const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;

        const { result } = await squareClient.catalogApi.deleteCatalogObject(id);

        return res.json({
            success: true,
            message: "Discount deleted successfully",
            deletedAt: result.deletedAt
        });

    } catch (error) {
        console.error('Error deleting discount:', error);
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                error: "Discount not found"
            });
        }
        return res.status(500).json({
            success: false,
            error: "Failed to delete discount",
            details: error.errors?.[0]?.detail || error.message
        });
    }
};