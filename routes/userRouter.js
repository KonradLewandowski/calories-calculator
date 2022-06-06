const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.put('/resetPassword/:token', authController.resetPassword);
router.put('/updateMyPassword', authController.protect, authController.updatePassword);

router.put('/updateMe', authController.protect, userController.updateMe);
router.put('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers);
router.route('/me').get(authController.protect, userController.getMe, userController.getUserById);
router.route('/:id').get(userController.getUserById);

router.delete('/deleteUser/:id', userController.deleteUser);
module.exports = router;
