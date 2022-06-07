const User = require('../models/userModel');
const Day = require('../models/dayModel');
const Meal = require('./../models/mealModel');
const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync');

const APIFeatures = require('./../utils/apiFeatures');

const sendRespond = (res, query, title, token = null) => {
  // console.log(token);

  res.status(200).render(query, {
    title,
    token,
  });
};

exports.mainPage = (req, res) => {
  sendRespond(res, 'main', 'Calculator');
};

exports.login = (req, res) => {
  sendRespond(res, 'login', 'Login');
};

exports.signup = (req, res) => {
  sendRespond(res, 'signup', 'Sign up');
};

exports.settings = (req, res) => {
  sendRespond(res, 'settings', 'Settings');
};

exports.day = (req, res) => {
  sendRespond(res, 'day', 'Day');
};

exports.forgotPassword = (req, res) => {
  sendRespond(res, 'forgotPassword', 'Forgot password?');
};

exports.resetPassword = (req, res) => {
  const token = req.query;
  sendRespond(res, 'resetPassword', 'Reset password', token);
};

exports.deleteMe = (req, res) => {
  sendRespond(res, 'deleteMe', 'Delete Account');
};

exports.aboutProject = (req, res) => {
  sendRespond(res, 'aboutProject', 'About Project');
};

exports.paginationQuery = factory.pagination(Day);

exports.updateUserData = catchAsync(async (req, res, next) => {
  //auth protect before
  const updatedUser = User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('settings', {
    user: updatedUser,
  });
});

exports.dayOverview = catchAsync(async (req, res, next) => {
  // 1) Get history data from collection
  const results = await Day.find({ history: res.locals.user.history }).sort('-createdAt');
  const features = new APIFeatures(Day.find({ history: res.locals.user.history }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const days = await features.query;
  res.locals.dates = results;
  //delete not saved meals
  const meals = await Meal.deleteMany({ userID: res.locals.user._id, active: { $ne: true } });

  res.status(200).render('overview', {
    title: 'Your page',
    result: days.length,
    days,
    req,
  });
});
