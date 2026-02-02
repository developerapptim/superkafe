const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const { checkJwt } = require('../middleware/auth');

router.use(checkJwt);

router.get('/', AttendanceController.getAll);
router.get('/today', AttendanceController.getToday);
router.post('/clock-in', AttendanceController.clockIn);
router.post('/clock-out', AttendanceController.clockOut);
router.post('/', AttendanceController.create);
router.patch('/:id', AttendanceController.update);

module.exports = router;
