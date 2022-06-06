const User = require('./../models/userModel');
const factory = require('./factoryController');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).map((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

///factory controllers
exports.getAllUsers = factory.getAll(User, 'history');
exports.getUserById = factory.getOne(User, 'history');
exports.deleteUser = factory.deleteOne(User);

// own controllers
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = await req.user.id;

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You can not change your password here', 400));
  }

  //3) Filtered out unwanted fields names that are not allawed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'history');

  //3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  //1) Get user form the collection
  const user = await User.findById(req.user.id).select('+password');

  //2) Check if POSTed passwrod is correct
  if (!user || !(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  user.active = false;
  await user.save();

  // await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
