const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/FinanceController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.get('/', FinanceController.getDebts);
router.post('/', FinanceController.addDebt);
router.put('/:id', FinanceController.updateDebt);
router.put('/:id/settle', FinanceController.settleDebt); // Added settle
router.delete('/:id', FinanceController.deleteDebt);

module.exports = router;
