import { randomUUID } from 'crypto';
import { squareClient } from '../utils/square.config.js';
import { safeSerialize } from '../utils/jsonUtils.js';
// Create a checkout session
export const createCheckout = async (req, res) => {
  try {
    const {
      items,  // Array of items with quantity
      customerId, // Optional: Square Customer ID
      note, // Optional: Order note
      locationId // Required: Square Location ID
    } = req.body;

    // Create line items for the order
    const lineItems = items.map(item => ({
      quantity: item.quantity.toString(),
      catalogObjectId: item.itemId,
      // Optional modifiers can go here
      modifiers: item.modifiers || []
    }));

    const checkoutRequest = {
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        lineItems,
        // Optional customer ID
        customerId: customerId || undefined,
        // Optional note
        note: note || undefined
      },
      // Redirect URLs after payment
      redirectUrl: `${process.env.FRONTEND_URL}/order-confirmation`,
      // Payment methods accepted
      paymentMethods: {
        applePay: true,
        googlePay: true,
        cashAppPay: true,
        card: true
      }
    };

    const { result } = await squareClient.checkoutApi.createPaymentLink(checkoutRequest);
    const serializedResult = safeSerialize(result);

    return res.status(201).json({
      success: true,
      checkout: serializedResult,
      checkoutUrl: serializedResult.paymentLink.url
    });

  } catch (error) {
    console.error('Error creating checkout:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to create checkout",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};

// Retrieve checkout status
export const getCheckoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { result } = await squareClient.checkoutApi.retrievePaymentLink(id);
    const serializedResult = safeSerialize(result);

    return res.json({
      success: true,
      checkout: serializedResult
    });

  } catch (error) {
    console.error('Error fetching checkout:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch checkout status",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};

export const createAdvancedCheckout = async (req, res) => {
  try {
    const {
      items,
      locationId,
      customerId,
      note,
      // Advanced options
      discounts = [],
      taxes = [],
      tipSettings = {
        allowCustomTip: true,
        suggestedTipPercentages: [15, 18, 20, 25]
      },
      shippingOptions = [],
      fulfillment = {
        type: 'PICKUP',
        pickupDetails: {
          pickupAt: '2024-03-20T15:00:00Z',
          note: 'Please pickup at counter'
        }
      },
      // Additional preferences
      prePopulateBuyerEmail = '',
      prePopulateShippingAddress = undefined,
      acceptedPaymentMethods = {
        applePay: true,
        googlePay: true,
        cashAppPay: true,
        card: true
      }
    } = req.body;

    // Create line items with detailed options
    const lineItems = items.map(item => ({
      quantity: item.quantity.toString(),
      catalogObjectId: item.itemId,
      modifiers: item.modifiers?.map(mod => ({
        catalogObjectId: mod.catalogObjectId,
        quantity: mod.quantity?.toString() || "1"
      })) || [],
      // Applied discounts specific to this item
      appliedDiscounts: item.discounts?.map(discount => ({
        discountUid: discount.id,
        scope: discount.scope || 'LINE_ITEM'
      })) || [],
      // Item-specific taxes
      appliedTaxes: item.taxes?.map(tax => ({
        taxUid: tax.id,
        scope: tax.scope || 'LINE_ITEM'
      })) || [],
      note: item.specialInstructions
    }));

    // Process order-level discounts
    const orderDiscounts = discounts.map(discount => ({
      uid: randomUUID(),
      catalogObjectId: discount.id,
      scope: discount.scope || 'ORDER'
    }));

    // Process order-level taxes
    const orderTaxes = taxes.map(tax => ({
      uid: randomUUID(),
      ...(tax.catalogObjectId ? {
        catalogObjectId: tax.catalogObjectId
      } : {
        name: tax.name,
        type: 'ADDITIVE',
        percentage: tax.percentage.toString()
      }),
      scope: tax.scope || 'ORDER'
    }));

    // Configure shipping options
    const processedShippingOptions = shippingOptions.map(option => ({
      name: option.name,
      charge: {
        amount: parseInt((option.amount * 100).toString(), 10),
        currency: 'USD'
      },
      duration: option.duration || '1-2 business days'
    }));

    const checkoutRequest = {
      idempotencyKey: randomUUID(),
      order: {
        locationId,
        lineItems,
        customerId: customerId || undefined,
        note: note || undefined,
        // Add fulfillment details
        fulfillments: [{
          type: fulfillment.type,
          state: 'PROPOSED',
          ...(fulfillment.type === 'PICKUP' && {
            pickupDetails: fulfillment.pickupDetails
          }),
          ...(fulfillment.type === 'DELIVERY' && {
            deliveryDetails: fulfillment.deliveryDetails
          })
        }],
        // Add discounts and taxes
        discounts: orderDiscounts,
        taxes: orderTaxes
      },
      // Checkout preferences
      redirectUrl: `${process.env.FRONTEND_URL}/order-confirmation`,
      paymentMethods: acceptedPaymentMethods,
      // Pre-populate buyer info if available
      prePopulateBuyerEmail: prePopulateBuyerEmail || undefined,
      prePopulateShippingAddress: prePopulateShippingAddress || undefined,
      // Add tip settings
      tipSettings: {
        allowCustomTip: tipSettings.allowCustomTip,
        separateTipScreen: true,
        smartTipping: true,
        defaultTipPercentages: tipSettings.suggestedTipPercentages
      },
      // Add shipping options if available
      shippingOptions: processedShippingOptions.length > 0 ? 
        processedShippingOptions : undefined
    };

    // Clean up undefined values
    const cleanedRequest = JSON.parse(JSON.stringify(checkoutRequest));
    console.log('Creating checkout with payload:', JSON.stringify(cleanedRequest, null, 2));

    const { result } = await squareClient.checkoutApi.createPaymentLink(cleanedRequest);
    const serializedResult = safeSerialize(result);

    return res.status(201).json({
      success: true,
      checkout: serializedResult,
      checkoutUrl: serializedResult.paymentLink.url
    });

  } catch (error) {
    console.error('Error creating checkout:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to create checkout",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};

// Get all checkouts
export const getAllCheckouts = async (req, res) => {
  try {
    const { locationId, cursor } = req.query;

    if (!locationId) {
      return res.status(400).json({
        success: false,
        error: "Location ID is required"
      });
    }

    // Search for payment links with proper parameter formatting
    const { result } = await squareClient.checkoutApi.listPaymentLinks(cursor || undefined);

    // Filter payment links by location if needed
    const checkouts = result.paymentLinks?.filter(link => {
      return link.order?.locationId === locationId;
    }) || [];

    const serializedResult = safeSerialize({
      paymentLinks: checkouts,
      cursor: result.cursor // Include cursor for pagination
    });

    return res.json({
      success: true,
      checkouts: serializedResult.paymentLinks,
      cursor: serializedResult.cursor
    });

  } catch (error) {
    console.error('Error fetching checkouts:', error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch checkouts",
      details: error.errors?.[0]?.detail || error.message
    });
  }
};