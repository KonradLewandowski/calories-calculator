const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const sendResponse = (res, statusCode, data = null) => {
  res.status(statusCode).json({
    status: 'success',
    results: data === null ? (res.result = undefined) : data.length,
    data: data,
  });
};

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 201;
    const document = await Model.create(req.body);

    //SEND RESPONSE
    sendResponse(res, statusCode, document);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 201;
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) next(new AppError('No product found with that ID', 404));

    //SEND RESPONSE
    sendResponse(res, statusCode, document);
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 200;
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) next(new AppError('No product found with that ID', 404));
    //SEND RESPONSE
    sendResponse(res, statusCode, null);
  });

exports.getAll = (Model, ...populate) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 200;
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;

    // const documents = await Model.find().populate(populate);

    if (documents.length === 0) next(new AppError('Can not find any document right now', 404));

    //SEND RESPONSE
    sendResponse(res, statusCode, documents);
  });

exports.getOne = (Model, ...populate) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 200;
    const document = await Model.findById(req.params.id);

    if (!document) next(new AppError('No document found with that ID', 404));
    req.params.name
      ? next()
      : //SEND RESPONSE
        sendResponse(res, statusCode, document);
  });

exports.filtered = (Model) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 200;
    const document = await Model.find({
      name: { $regex: req.params.name, $options: 'i' },
    });

    //SEND RESPONSE
    sendResponse(res, statusCode, document);
  });

exports.deleteAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const statusCode = await 200;
    const document = await Model.deleteMany({});

    //SEND RESPONSE
    sendResponse(res, statusCode, null);
  });

exports.pagination = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.query.page) req.query.page = 1;

    req.query.limit = '11';
    req.query.fields = '-__v';
    req.query.sort = '-createdAt';

    next();
  });
