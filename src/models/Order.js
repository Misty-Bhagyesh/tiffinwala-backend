const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber:  { type: String, unique: true },
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meal:         { id: String, name: String, price: Number, emoji: String },
    addons:       [{ id: String, name: String, price: Number, emoji: String }],
    slot:         { type: String, enum: ['lunch', 'dinner', 'both'], required: true },
    plan:         { type: String, required: true },
    planType:     { type: String, enum: ['single', 'subscription'], default: 'single' },
    isAlternate:  { type: Boolean, default: false },
    startDate:    Date,
    endDate:      Date,
    skippedDates: [{ type: String }],
    totalAmount:  { type: Number, required: true },
    deliveryFee:  { type: Number, default: 0 },
    address:      { line1: String, line2: String, city: String, pincode: String },
    deliveryLocation: { lat: Number, lon: Number, area: String, distanceKm: Number },
    payment: {
      method:       { type: String, enum: ['qr', 'upi', 'cod', null], default: null },
      status:       { type: String, enum: ['pending', 'submitted', 'verified', 'failed'], default: 'pending' },
      txnId:        String,
      screenshotUrl:String,
      submittedAt:  Date,
      verifiedAt:   Date,
    },
    status: {
      type: String,
      enum: ['placed','payment_submitted','payment_verified','confirmed','out_for_delivery','delivered','cancelled'],
      default: 'placed',
    },
    couponCode:    String,
    discountAmount:{ type: Number, default: 0 },
    adminNote:     String,
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TW-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
