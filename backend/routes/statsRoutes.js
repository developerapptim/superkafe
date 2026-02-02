const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.get('/', StatsController.getDashboardStats);

module.exports = router;
