const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/FinanceController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.get('/analytics', FinanceController.getCashAnalytics);
router.get('/breakdown', FinanceController.getCashBreakdown);

module.exports = router;
