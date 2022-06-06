const express = require('express');
const historyController = require('./../controllers/historyController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', historyController.getAllHistory);
router.get('/getHistory/:id', authController.protect, historyController.getHistory);
router.put('/updateHistory/:id', authController.protect, historyController.updateHistory);
router.delete('/deleteHistory/:id', authController.protect, historyController.deleteHistory);

router.delete('/deleteAllHistory', historyController.deleteAllHistory);
module.exports = router;
