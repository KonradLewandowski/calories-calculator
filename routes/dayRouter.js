const express = require('express');
const dayController = require('./../controllers/dayController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/getAllDays', dayController.paginationQuery, dayController.getAllDays);
router.get(
  '/findByDate/:date',
  authController.protect,
  dayController.paginationQuery,
  dayController.findByDate
);

router.get('/getDay/:id', authController.protect, dayController.getDay);
router.post('/createNewDay', authController.protect, dayController.createDay);
router.put('/updateDay/:id', authController.protect, dayController.updateDay);
router.delete(
  '/deleteDay/:id',
  authController.protect,
  authController.restrictTo('user', 'admin'),
  dayController.deleteDay
);

router.delete('/deleteAllDays/', dayController.deleteAll);

module.exports = router;
