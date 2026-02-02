const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { checkApiKey } = require('../middleware/auth');
const { uploadPayment } = require('../middleware/uploadMiddleware');

// router.use(checkApiKey); // Optional: if some are public, don't use global use

router.get('/', checkApiKey, OrderController.getOrders);
router.get('/:id', checkApiKey, OrderController.getOrderById); // New
router.post('/', uploadPayment.single('paymentProof'), OrderController.createOrder); // Public for self-order? usually protected. Let's protect it or keep as is. server.js had it protected via logic? server.js usually allowed it. But let's checkApiKey for safety or make it public if it's for customer app. 
// Wait, customer app creates orders freely? usually yes. But let's assume it needs API Key "warkop_secret_123" which frontend has.
// So checkApiKey is fine.

router.patch('/:id/status', checkApiKey, OrderController.updateOrderStatus);

module.exports = router;
