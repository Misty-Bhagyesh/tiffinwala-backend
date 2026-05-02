const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:        { type: String, enum: ['percent', 'flat'], required: true },
    value:       { type: Number, required: true },
    description: { type: String },
    minOrder:    { type: Number, default: 0 },
    maxUses:     { type: Number, default: 100 },
    usedCount:   { type: Number, default: 0 },
    expiry:      { type: Date },
    isActive:    { type: Boolean, default: true },
    applicablePlans: [String], // if empty, applies to all
  },
  { timestamps: true }
);

offerSchema.methods.validate = function (orderAmount) {
  if (!this.isActive)              return { valid: false, reason: 'Offer is not active' };
  if (this.expiry && this.expiry < new Date()) return { valid: false, reason: 'Offer has expired' };
  if (this.usedCount >= this.maxUses)          return { valid: false, reason: 'Offer usage limit reached' };
  if (orderAmount < this.minOrder)             return { valid: false, reason: `Minimum order ₹${this.minOrder} required` };
  const discount = this.type === 'percent'
    ? Math.round((orderAmount * this.value) / 100)
    : this.value;
  return { valid: true, discount };
};

module.exports = mongoose.model('Offer', offerSchema);
