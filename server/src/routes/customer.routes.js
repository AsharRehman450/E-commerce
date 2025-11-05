import express from 'express';
import { 
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomers
} from '../controllers/customer.controller.js';

const router = express.Router();

// Create new customer
router.post('/customer', createCustomer);

// Get all customers
router.get('/customers', getAllCustomers);

// Search customers
router.get('/customer/search', searchCustomers);

// Get single customer
router.get('/customer/:id', getCustomerById);

// Update customer
router.put('/customer/:id', updateCustomer);

// Delete customer
router.delete('/customer/:id', deleteCustomer);

export default router;