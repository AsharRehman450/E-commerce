import express from 'express';
import {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount
} from '../controllers/discount.controller.js';

const router = express.Router();

router.get('/discounts', getAllDiscounts);
router.get('/discounts/:id', getDiscountById);
router.post('/discounts', createDiscount);
router.put('/discounts/:id', updateDiscount);
router.delete('/discounts/:id', deleteDiscount);

export default router;