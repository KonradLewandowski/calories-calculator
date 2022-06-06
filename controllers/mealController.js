const Meal = require('./../models/mealModel');
const factory = require('./factoryController');
const catchAsync = require('./../utils/catchAsync');

exports.createNewMeal = catchAsync(async (req, res, next) => {
  const meal = await Meal.create(req.body);
  meal.userID = req.user.id;
  meal.save();

  res.status(200).json({
    status: 'success',
    data: meal,
  });
});
exports.getOneMeal = factory.getOne(Meal);
exports.updateMeal = factory.updateOne(Meal);
exports.getAllMeals = factory.getAll(Meal, 'product');

exports.deleteAllMeals = factory.deleteAll(Meal);
exports.deleteOneMeal = factory.deleteOne(Meal);
