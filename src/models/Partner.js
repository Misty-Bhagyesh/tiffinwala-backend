const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    ownerName:  { type: String, required: true },
    phone:      { type: String, required: true },
    city:       { type: String, required: true },
    zone:       { type: String },
    kitchenLat: { type: Number },
    kitchenLon: { type: Number },
    isActive:   { type: Boolean, default: true },
    admins:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', partnerSchema);
