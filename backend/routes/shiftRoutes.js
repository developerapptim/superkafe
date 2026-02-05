const express = require('express');
const router = express.Router();
const ShiftController = require('../controllers/ShiftController');
const { checkJwt } = require('../middleware/auth');

// Protect all shift routes with JWT
router.use(checkJwt);

router.post('/start', ShiftController.startShift); // Legacy/Internal
router.post('/open', ShiftController.openShift); // New Request
router.get('/current', ShiftController.getCurrentShift);
router.get('/current-balance', ShiftController.getCurrentBalance);
router.get('/history', ShiftController.getShiftHistory); // NEW
router.get('/activities', ShiftController.getActivities); // NEW
router.post('/end', ShiftController.endShift); // Legacy/Internal
router.put('/close', ShiftController.closeShift); // New Request


module.exports = router;
