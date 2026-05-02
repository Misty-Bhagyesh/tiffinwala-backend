const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    id:          { type: String, required: true, unique: true }, // e.g. 'weekly', 'alternate_weekly'
    name:        { type: String, required: true },
    emoji:       { type: String, default: '📦' },
    type:        { type: String, enum: ['single', 'subscription'], default: 'subscription' },
    pricePerDay: { type: Number, default: null },
    totalPrice:  { type: Number, default: 0 },
    days:        { type: Number, default: 0 },
    color:       { type: String, default: '#E8832A' },
    highlight:   { type: Boolean, default: false },
    badge:       { type: String, default: null },
    description: { type: String },
    features:    [String],
    isAlternate: { type: Boolean, default: false },   // alternate-day delivery
    alternateDays:[String],                            // ['Mon','Wed','Fri','Sun']
    canSkip:     { type: Boolean, default: false },
    codAllowed:  { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
