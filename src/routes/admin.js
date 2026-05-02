const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalOrders,
      pendingPayment,
      confirmedOrders,
      totalUsers,
      revenue,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'payment_submitted' }),
      Order.countDocuments({ status: { $in: ['confirmed', 'out_for_delivery', 'delivered'] } }),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { status: { $in: ['confirmed', 'out_for_delivery', 'delivered'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    res.json({
      totalOrders,
      pendingPayment,
      confirmedOrders,
      totalUsers,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders/pending — orders awaiting payment verification
router.get('/orders/pending', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'payment_submitted' })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
