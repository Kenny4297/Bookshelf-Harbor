const express = require('express');
const router = express.Router();

// Controllers
const { 
  createOrder, 
  getUserOrders, 
  getLastUserOrder  // import the new controller function
} = require('../../controllers/order-controller');

// Routes
router.route('/').post(createOrder);
router.route('/:userId').get(getUserOrders);
router.route('/:userId/last').get(getLastUserOrder);  // add the new route

module.exports = router;
