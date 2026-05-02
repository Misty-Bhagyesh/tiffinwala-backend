const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', mealController.getMeals);
router.get('/addons', mealController.getAddons);
router.post('/', protect, adminOnly, mealController.createMeal);
router.patch('/:id', protect, adminOnly, mealController.updateMeal);

module.exports = router;
