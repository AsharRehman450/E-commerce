import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
  deleteAllOrders,
  getOrderStats,
  getRecentOrders,
} from '../controllers/order.controller.js';

const router = express.Router();

// Create new order
router.post('/order', createOrder);

// Get all orders
router.get('/orders', getAllOrders);

// Get single order
router.get('/order/:id', getOrderById);

// Update order
router.put('/order/:id', updateOrder);

// Cancel order
router.delete('/order/:id', cancelOrder);

// Delete all orders
router.delete('/orders', deleteAllOrders);

// stats
router.get("/orders-stats", getOrderStats);

//recent orders
router.get('/recent-orders', getRecentOrders);


export default router;