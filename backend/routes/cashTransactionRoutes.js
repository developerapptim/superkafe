const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/FinanceController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.get('/', FinanceController.getCashTransactions);
router.post('/', FinanceController.addCashTransaction);
router.delete('/:id', FinanceController.deleteCashTransaction);

module.exports = router;
