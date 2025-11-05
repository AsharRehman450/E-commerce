// import { randomUUID } from 'crypto';
// import { squareClient } from "../utils/square.config.js";
// import { safeSerialize } from '../utils/jsonUtils.js';

// // Create order
// export const createOrder = async (req, res) => {
//   try {
//     const { 
//       locationId,
//       customerId,
//       lineItems,
//       note 
//     } = req.body;

//     // Validate required fields
//     if (!locationId || !lineItems || lineItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Location ID and at least one line item are required"
//       });
//     }

//     // Verify location exists
//     try {
//       await squareClient.locationsApi.retrieveLocation(locationId);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid location ID"
//       });
//     }

//     // Verify customer exists if provided
//     if (customerId) {
//       try {
//         await squareClient.customersApi.retrieveCustomer(customerId);
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: "Invalid customer ID"
//         });
//       }
//     }

//     // Verify all catalog items exist
//     for (const item of lineItems) {
//       try {
//         await squareClient.catalogApi.retrieveCatalogObject(item.catalogObjectId);
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: `Invalid catalog item ID: ${item.catalogObjectId}`
//         });
//       }
//     }

//     const orderPayload = {
//       idempotencyKey: randomUUID(),
//       order: {
//         locationId,
//         customerId,
//         lineItems: lineItems.map(item => ({
//           quantity: item.quantity.toString(),
//           catalogObjectId: item.catalogObjectId,
//           note: item.note
//         })),
//         state: "DRAFT", // Start as draft
//         note
//       }
//     };

//     console.log('Creating order with payload:', JSON.stringify(orderPayload, null, 2));

//     const { result } = await squareClient.ordersApi.createOrder(orderPayload);

//     return res.status(201).json(safeSerialize({
//       success: true,
//       message: "Order created successfully",
//       order: result.order
//     }));

//   } catch (error) {
//     console.error('Error creating order:', error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to create order",
//       details: error.message
//     });
//   }
// };

// // Get all orders
// export const getAllOrders = async (req, res) => {
//   try {
//     // First get all active locations
//     const { result: locationResult } = await squareClient.locationsApi.listLocations();
//     const activeLocationIds = locationResult.locations
//       .filter(location => location.status === "ACTIVE")
//       .map(location => location.id);

//     if (activeLocationIds.length === 0) {
//       return res.json(safeSerialize({
//         success: true,
//         orders: [],
//         message: "No active locations found"
//       }));
//     }

//     // Search orders from active locations
//     const { result } = await squareClient.ordersApi.searchOrders({
//       locationIds: activeLocationIds,
//       limit: 100
//     });

//     return res.json(safeSerialize({
//       success: true,
//       orders: result.orders || [],
//     }));

//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch orders",
//       details: error.message
//     });
//   }
// };

// // Get order by ID
// export const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { result } = await squareClient.ordersApi.retrieveOrder(id);

//     return res.json(safeSerialize({
//       success: true,
//       order: result.order
//     }));

//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch order",
//       details: error.message
//     });
//   }
// };

// // Update order
// export const updateOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       lineItems,
//       customerId,
//       note 
//     } = req.body;

//     // First get the existing order
//     const { result: existingOrder } = await squareClient.ordersApi.retrieveOrder(id);

//     const updatePayload = {
//       order: {
//         locationId: existingOrder.order.locationId,
//         customerId: customerId || existingOrder.order.customerId,
//         lineItems: lineItems?.map(item => ({
//           quantity: item.quantity.toString(),
//           catalogObjectId: item.catalogObjectId,
//           note: item.note
//         })) || existingOrder.order.lineItems,
//         version: existingOrder.order.version,
//         note: note || existingOrder.order.note
//       },
//       idempotencyKey: randomUUID()
//     };

//     const { result } = await squareClient.ordersApi.updateOrder(id, updatePayload);

//     return res.json(safeSerialize({
//       success: true,
//       message: "Order updated successfully",
//       order: result.order
//     }));

//   } catch (error) {
//     console.error('Error updating order:', error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to update order",
//       details: error.message
//     });
//   }
// };

// // Cancel order
// export const cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // First get the existing order
//     const { result: existingOrder } = await squareClient.ordersApi.retrieveOrder(id);

//     // Update order state to CANCELED
//     const updatePayload = {
//       order: {
//         locationId: existingOrder.order.locationId,
//         version: existingOrder.order.version,
//         state: "CANCELED"
//       },
//       idempotencyKey: randomUUID()
//     };

//     const { result } = await squareClient.ordersApi.updateOrder(id, updatePayload);

//     return res.json(safeSerialize({
//       success: true,
//       message: "Order cancelled successfully",
//       order: result.order
//     }));

//   } catch (error) {
//     console.error('Error cancelling order:', error);
//     if (error.statusCode === 404) {
//       return res.status(404).json({
//         success: false,
//         error: "Order not found"
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       error: "Failed to cancel order",
//       details: error.message
//     });
//   }
// };

// // Delete all orders
// export const deleteAllOrders = async (req, res) => {
//   try {
//     const { locationId } = req.query;

//     if (!locationId) {
//       return res.status(400).json({
//         success: false,
//         error: "Location ID is required"
//       });
//     }

//     // First, get all orders for the location
//     const { result } = await squareClient.ordersApi.searchOrders({
//       locationIds: [locationId],
//       limit: 100
//     });

//     if (!result.orders || result.orders.length === 0) {
//       return res.json({
//         success: true,
//         message: "No orders to delete"
//       });
//     }

//     const results = {
//       succeeded: [],
//       failed: []
//     };

//     const cancelPromises = result.orders.map(async order => {
//       try {
//         // Skip orders that have payments
//         if (order.tenders && order.tenders.length > 0) {
//           results.failed.push({
//             orderId: order.id,
//             reason: "Order has payments and cannot be canceled"
//           });
//           return;
//         }

//         // Skip orders that are already canceled
//         if (order.state === "CANCELED") {
//           results.failed.push({
//             orderId: order.id,
//             reason: "Order is already canceled"
//           });
//           return;
//         }

//         // Skip orders that are completed
//         if (order.state === "COMPLETED") {
//           results.failed.push({
//             orderId: order.id,
//             reason: "Cannot cancel completed orders"
//           });
//           return;
//         }

//         let currentOrder = order;

//         // First update fulfillments if they exist
//         if (order.fulfillments && order.fulfillments.length > 0) {
//           try {
//             console.log(`Processing order ${order.id} with state ${order.state}`);
//             console.log('Current fulfillments:', JSON.stringify(order.fulfillments, null, 2));

//             let fulfillmentState = "CANCELED";
            
//             // If order is in DRAFT state, fulfillments must be PROPOSED first
//             if (order.state === "DRAFT") {
//               fulfillmentState = "PROPOSED";
//             }

//             const fulfillmentUpdatePayload = {
//               order: {
//                 locationId: currentOrder.locationId,
//                 version: currentOrder.version,
//                 fulfillments: currentOrder.fulfillments.map(fulfillment => ({
//                   uid: fulfillment.uid,
//                   type: fulfillment.type,
//                   state: fulfillmentState
//                 }))
//               },
//               idempotencyKey: randomUUID()
//             };

//             console.log('Fulfillment update payload:', JSON.stringify(fulfillmentUpdatePayload, null, 2));

//             const { result: updatedOrder } = await squareClient.ordersApi.updateOrder(currentOrder.id, fulfillmentUpdatePayload);
//             currentOrder = updatedOrder.order;

//             // If we set fulfillments to PROPOSED, we need another update to cancel them
//             if (fulfillmentState === "PROPOSED") {
//               const cancelFulfillmentPayload = {
//                 order: {
//                   locationId: currentOrder.locationId,
//                   version: currentOrder.version,
//                   fulfillments: currentOrder.fulfillments.map(fulfillment => ({
//                     uid: fulfillment.uid,
//                     type: fulfillment.type,
//                     state: "CANCELED"
//                   }))
//                 },
//                 idempotencyKey: randomUUID()
//               };
//               const { result: orderWithCanceledFulfillments } = await squareClient.ordersApi.updateOrder(currentOrder.id, cancelFulfillmentPayload);
//               currentOrder = orderWithCanceledFulfillments.order;
//             }
//           } catch (fulfillmentError) {
//             console.error('Fulfillment update error:', fulfillmentError);
//             results.failed.push({
//               orderId: order.id,
//               reason: `Failed to update fulfillments: ${fulfillmentError.detail || fulfillmentError.message || 'Unknown error'}`,
//               state: order.state
//             });
//             return;
//           }
//         }

//         // Then cancel the order
//         const updatePayload = {
//           order: {
//             locationId: currentOrder.locationId,
//             version: currentOrder.version,
//             state: "CANCELED"
//           },
//           idempotencyKey: randomUUID()
//         };

//         const { result: canceledOrder } = await squareClient.ordersApi.updateOrder(currentOrder.id, updatePayload);
//         results.succeeded.push(canceledOrder.order.id);
//       } catch (error) {
//         console.error('Order cancellation error:', error);
//         results.failed.push({
//           orderId: order.id,
//           reason: error.detail || error.message || 'Unknown error',
//           state: order.state,
//           error: error
//         });
//       }
//     });

//     await Promise.all(cancelPromises);

//     return res.json({
//       success: true,
//       message: `Successfully canceled ${results.succeeded.length} orders. ${results.failed.length} orders could not be canceled.`,
//       results
//     });

//   } catch (error) {
//     console.error('Error deleting orders:', error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to delete orders",
//       details: error.message
//     });
//   }
// };

// export const getOrderStats = async (req, res) => {
//   try {
 
//     const { result: locationResult } = await squareClient.locationsApi.listLocations();
//     const activeLocationIds = locationResult.locations
//       .filter(location => location.status === "ACTIVE")
//       .map(location => location.id);

//     if (activeLocationIds.length === 0) {
//       return res.json({
//         success: true,
//         data: {
//           totalOrders: 0,
//           canceledOrders: 0,
//           pendingOrders: 0,
//           successedOrders: 0,
//         },
//         message: "No active locations found",
//       });
//     }

//     const { result } = await squareClient.ordersApi.searchOrders({
//       locationIds: activeLocationIds,
//       limit: 100, 
//     });

//     const orders = result.orders || [];
    
//     const stats = orders.reduce(
//       (acc, order) => {
//         acc.totalOrders++;
//         if (order.state === "CANCELED") acc.canceledOrders++;
//         if (order.state === "OPEN") acc.pendingOrders++; 
//         if (order.state === "COMPLETED") acc.successedOrders++;
//         return acc;
//       },
//       {
//         totalOrders: 0,
//         canceledOrders: 0,
//         pendingOrders: 0,
//         successedOrders: 0,
//       }
//     );

//     return res.json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     console.error("Error fetching order stats:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch order stats",
//       details: error.message,
//     });
//   }
// };


// export const getRecentOrders = async (req, res) => {
//   try {

//     const { result: locationResult } = await squareClient.locationsApi.listLocations();
//     const activeLocationIds = locationResult.locations
//       .filter(location => location.status === "ACTIVE")
//       .map(location => location.id);

//     if (activeLocationIds.length === 0) {
//       return res.json({
//         success: true,
//         orders: [],
//         message: "No active locations found",
//       });
//     }


//     const { result } = await squareClient.ordersApi.searchOrders({
//       locationIds: activeLocationIds,
//       limit: 10,
//       query: {
//         sort: {
//           sortField: "CLOSED_AT",
//           sortOrder: "DESC",
//         },
//         filter: {
//           stateFilter: {
//             states: ["COMPLETED", "CANCELED"], 
//           },
//         },
//       },
//     });

//     const recentOrders = (result.orders || []).map(order => {
    
//       return JSON.parse(
//         JSON.stringify(order, (key, value) =>
//           typeof value === "bigint" ? value.toString() : value
//         )
//       );
//     });

//     return res.json({
//       success: true,
//       orders: recentOrders,
//     });
//   } catch (error) {
//     console.error("Error fetching recent orders:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch recent orders",
//       details: error.message,
//     });
//   }
// };



import Order from '../models/order.model.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const {cart, subtotal, discount, delivery, total } = req.body;

    const newOrder = new Order({
      items: cart,
      subtotal,
      discount,
      delivery,
      total,
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: savedOrder._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get order', error: error.message });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Order updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

// Cancel Order (sets status to "Canceled")
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'Canceled';
    await order.save();

    res.json({ success: true, message: 'Order canceled', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
  }
};

// Delete All Orders
export const deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany();
    res.json({ success: true, message: 'All orders deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete orders', error: error.message });
  }
};

// Get Order Stats
export const getOrderStats = async (req, res) => {
  try {
    const stats = {
      totalOrders: await Order.countDocuments(),
      canceledOrders: await Order.countDocuments({ status: 'Canceled' }),
      pendingOrders: await Order.countDocuments({ status: 'Pending' }),
      completedOrders: await Order.countDocuments({ status: 'Completed' }),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get stats', error: error.message });
  }
};

// Get Recent Orders
export const getRecentOrders = async (req, res) => {
  try {
    const recent = await Order.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, orders: recent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get recent orders', error: error.message });
  }
};