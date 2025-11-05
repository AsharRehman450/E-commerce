import express from 'express';
import { createCheckout, getCheckoutStatus, createAdvancedCheckout, getAllCheckouts } from '../controllers/checkout.controller.js';

const checkout = express.Router();

// Create a new checkout session
checkout.post('/checkout', createCheckout);

// Create an advanced checkout session
checkout.post('/advanced-checkout', createAdvancedCheckout);

// Get checkout status
checkout.get('/checkout/:id', getCheckoutStatus);

// Get all checkouts
checkout.get('/checkouts', getAllCheckouts);

export default checkout;