const express = require('express');
const router = express.Router();

// Controllers
const { 
  createOrder, 
  getUserOrders
} = require('../../controllers/order-controller');

// Routes
router.route('/').post(createOrder);
router.route('/:userId').get(getUserOrders);

module.exports = router;
