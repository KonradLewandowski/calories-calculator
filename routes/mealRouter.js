const express = require('express');
const mealController = require('./../controllers/mealController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/getAllMeals', mealController.getAllMeals);
router.get('/getMeal/:id', mealController.getOneMeal);
router.post('/createMeal', authController.protect, mealController.createNewMeal);
router.put('/updateMeal/:id', mealController.updateMeal);
router.delete('/deleteAllMeals', mealController.deleteAllMeals);
router.delete('/deleteMeal/:id', mealController.deleteOneMeal);

module.exports = router;
