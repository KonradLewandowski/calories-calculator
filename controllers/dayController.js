const factory = require('./factoryController');
const Day = require('./../models/dayModel');
const Meal = require('./../models/mealModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

//factory controllers
exports.paginationQuery = factory.pagination(Day);
exports.getAllDays = factory.getAll(Day);
exports.getDay = factory.getOne(Day);
// exports.updateDay = factory.updateOne(Day);
exports.deleteAll = exports.deleteAll = factory.deleteAll(Day);

//own controllers
exports.createDay = catchAsync(async (req, res, next) => {
  req.body.userID = req.user.id;

  const day = await Day.create(req.body);

  day.history = req.user.history;
  day.save();

  //protect from delete saved meals
  const meals = await Meal.updateMany(
    { userID: req.user.id },
    { $set: { active: true } },
    { multi: true }
  );

  // SEND RESPONSE
  res.status(201).json({
    status: 'success',
    day,
  });
});

exports.updateDay = catchAsync(async (req, res, next) => {
  const meal = req.body.mealType;
  const day = await Day.findByIdAndUpdate(
    req.params.id,
    {
      $push: { [meal]: [req.body.data[meal]] },
      createdAt: req.body.data.createdAt,
      checker: `${req.body.data.createdAt}-${req.user.id}`,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!day) next(new AppError('No product found with that ID', 404));

  //SEND RESPONSE
  res.status(201).json({
    status: 'success',
    day,
  });
});

exports.findByDate = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Day.find().where({ history: req.user.history }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const days = await features.query;

  if (!days) next(new AppError('I am sorry but nothing found', 404));

  res.status(200).json({
    status: 'success',
    result: days.length,
    date: days,
  });
});

exports.deleteDay = catchAsync(async (req, res, next) => {
  const day = await Day.findById(req.params.id);
  let array = [];
  day.breakfast.map((el) => array.push(el._id));
  day.lunch.map((el) => array.push(el._id));
  day.dinner.map((el) => array.push(el._id));

  const meals = await Meal.deleteMany({ _id: array });
  await day.delete();

  res.status(200).json({
    status: 'success',
    result: meals.length,
    data: meals,
  });
});
