const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, productController.getAllProducts)
  .post(productController.createProduct);

router.get('/findProduct/:name', productController.getProductByName);
router.put(
  '/updateProduct/:id',
  authController.protect,
  authController.restrictTo('admin', 'coach'),
  productController.updateProduct
);
router.delete(
  '/deleteProduct/:id',
  authController.protect,
  authController.restrictTo('admin', 'coach'),
  productController.deleteProduct
);

router.get('/getProduct/:id', productController.getProduct);

router.delete('/deleteAllProducts', productController.deleteAllProducts);

module.exports = router;
