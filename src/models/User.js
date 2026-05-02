const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    phone:    { type: String, required: true, unique: true },
    email:    { type: String, sparse: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['customer', 'admin', 'master_admin'], default: 'customer' },
    isActive: { type: Boolean, default: true },
    // Address is OPTIONAL at signup - added during checkout
    address: {
      line1: String,
      line2: String,
      city: String,
      pincode: String,
    },
    fcmToken: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
