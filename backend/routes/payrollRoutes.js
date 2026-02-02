const express = require('express');
const router = express.Router();
const PayrollController = require('../controllers/PayrollController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.post('/calculate', PayrollController.calculate);

module.exports = router;
