const Meal = require('../models/Meal');

// Static add-ons (could also be in DB)
const ADDONS = [
  { id: 'chhas', name: 'Masala Chhas', price: 20, emoji: '🥛' },
  { id: 'gulab', name: 'Gulab Jamun', price: 30, emoji: '🍮' },
  { id: 'kheer', name: 'Kheer', price: 35, emoji: '🍚' },
  { id: 'jalebi', name: 'Jalebi', price: 25, emoji: '🍩' },
];

// GET /api/meals
exports.getMeals = async (req, res) => {
  try {
    let meals = await Meal.find({ isAvailable: true });
    // Seed with default meals if DB is empty
    if (meals.length === 0) {
      meals = await Meal.insertMany([
        { name: 'Gujarati Thali', price: 120, tag: 'MOST POPULAR', tagColor: '#E8832A', items: ['Sabji', 'Kathod', '5 Roti', 'Dal / Kadhi', 'Bhat', 'Salad'], emoji: '🍛', dots: ['#E8832A', '#F4A055', '#D4A017'] },
        { name: 'Punjabi Thali', price: 140, tag: "CHEF'S CHOICE", tagColor: '#C0392B', items: ['Paneer Subji', 'Dal Fry', 'Bhat', '5 Chapati', 'Salad'], emoji: '🫕', dots: ['#C0392B', '#E74C3C', '#F1948A'] },
        { name: 'Subji + Roti', price: 80, tag: 'LITE MEAL', tagColor: '#27AE60', items: ['Seasonal Subji', '5 Roti', 'Salad'], emoji: '🥙', dots: ['#27AE60', '#2ECC71', '#A9DFBF'], category: 'lite' },
      ]);
    }
    res.json({ meals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/meals/addons
exports.getAddons = async (req, res) => {
  res.json({ addons: ADDONS });
};

// POST /api/meals (admin)
exports.createMeal = async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json({ meal });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/meals/:id (admin)
exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meal) return res.status(404).json({ message: 'Meal not found.' });
    res.json({ meal });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
