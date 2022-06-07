const express = require('express');
const viewController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

//use in all of routs
router.use(authController.isLoggedIn);
router.get('/', viewController.mainPage);
router.get('/login', viewController.login);
router.get('/signup', viewController.signup);
router.get('/day', viewController.day);
router.get('/settings', viewController.settings);
router.get('/forgotPassword', viewController.forgotPassword);
router.get('/resetPassword', viewController.resetPassword);

router.get('/me', viewController.paginationQuery, viewController.dayOverview);
router.get('/aboutProject', viewController.aboutProject);

router.get('/deleteMe', viewController.deleteMe);

router.get('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;
