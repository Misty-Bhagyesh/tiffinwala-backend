const express = require('express');
const Meal = require('../models/Meal');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find({ isActive: true });
    res.json({ meals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/addons', async (req, res) => {
  try {
    const meals = await Meal.find();
    const addons = [];
    meals.forEach(m => {
      if (m.addons) addons.push(...m.addons);
    });
    res.json({ addons: [...new Map(addons.map(a => [a.id, a])).values()] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json({ meal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ meal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
