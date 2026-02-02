const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/FinanceController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.get('/expenses', FinanceController.getExpenses);
router.post('/expenses', FinanceController.addExpense);
router.get('/summary', FinanceController.getSummary);

module.exports = router;
