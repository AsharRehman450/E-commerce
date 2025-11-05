import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.div
          className="flex items-center justify-center mb-4"
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CheckCircle className="text-green-500 w-16 h-16" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold  transition"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccess;