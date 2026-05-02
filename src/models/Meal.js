const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tag: String,
    tagColor: String,
    items: [String],
    emoji: String,
    dots: [String],
    isAvailable: { type: Boolean, default: true },
    category: { type: String, enum: ['thali', 'lite'], default: 'thali' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meal', mealSchema);
