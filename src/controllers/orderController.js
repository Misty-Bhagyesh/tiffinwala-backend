const Order = require('../models/Order');
const path = require('path');

// POST /api/orders — create new order
exports.createOrder = async (req, res) => {
  try {
    const { meal, addons, slot, plan, startDate, endDate, totalAmount, address } = req.body;
    if (!meal || !slot || !plan || !totalAmount) {
      return res.status(400).json({ message: 'meal, slot, plan and totalAmount are required.' });
    }
    const order = await Order.create({
      user: req.user._id,
      meal, addons: addons || [],
      slot, plan,
      startDate: startDate || null,
      endDate: endDate || null,
      totalAmount, address: address || {},
    });
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my — get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('user', 'name phone');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/:id/payment — submit payment proof
exports.submitPayment = async (req, res) => {
  try {
    const { method, txnId } = req.body;
    const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.payment.status === 'verified') {
      return res.status(400).json({ message: 'Payment already verified.' });
    }

    order.payment = {
      method,
      status: 'submitted',
      txnId: txnId || null,
      screenshotUrl,
      submittedAt: new Date(),
    };
    order.status = 'payment_submitted';
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN ROUTES ───

// GET /api/orders — all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name phone address')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/orders/:id/status — update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = ['placed','payment_submitted','payment_verified','confirmed','out_for_delivery','delivered','cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });

    order.status = status;
    if (adminNote) order.adminNote = adminNote;

    // Mark payment verified time
    if (status === 'payment_verified') {
      order.payment.status = 'verified';
      order.payment.verifiedAt = new Date();
    }
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
