const factory = require('./factoryController');
const History = require('./../models/historyModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

//factory controllers
exports.getAllHistory = factory.getAll(History, 'userId');
exports.getHistory = factory.getOne(History, 'userId');
exports.updateHistory = factory.updateOne(History);
exports.deleteHistory = factory.deleteOne(History);

exports.deleteAllHistory = factory.deleteAll(History);

//own controllers
