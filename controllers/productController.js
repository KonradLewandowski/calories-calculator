const Product = require('./../models/productModel');
const factory = require('./factoryController');
const catchAsync = require('./../utils/catchAsync');

//factory controllers
// exports.createProduct = factory.createOne(Product);
exports.getProductByName = factory.filtered(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getProduct = factory.getOne(Product);
exports.getAllProducts = factory.getAll(Product);

exports.deleteAllProducts = factory.deleteAll(Product);

exports.createProduct = catchAsync(async (req, res, next) => {
  let product = await Product.findOne({ name: req.body.name });

  if (!product) return (product = await Product.create(req.body));

  //SEND RESPONSE
  res.status(201).json({
    status: 'success',
    data: product,
  });
});
