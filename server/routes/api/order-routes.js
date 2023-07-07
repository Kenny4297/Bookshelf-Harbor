const express = require("express");
const router = express.Router();

// Controllers
const {
    createOrder,
    getUserOrders,
    getLastUserOrder,
    getOrder,
} = require("../../controllers/order-controller");

// Routes
router.route("/").post(createOrder);
router.route("/order/:orderId").get(getOrder);
router.route("/user/:userId").get(getUserOrders);
router.route("/order/:userId/last").get(getLastUserOrder);

module.exports = router;
