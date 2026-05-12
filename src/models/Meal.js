const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    emoji:       { type: String },
    description: { type: String },
    items:       [String],
    tag:         { type: String },
    tagColor:    { type: String },
    isActive:    { type: Boolean, default: true },
    addons:      [{ id: String, name: String, price: Number, emoji: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', mealSchema);
