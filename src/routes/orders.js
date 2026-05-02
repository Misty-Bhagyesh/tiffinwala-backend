const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Multer config for payment screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `payment_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(file.mimetype));
  },
});

// Customer routes
router.post('/', protect, orderController.createOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.post('/:id/payment', protect, upload.single('screenshot'), orderController.submitPayment);

// Admin routes
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.patch('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
