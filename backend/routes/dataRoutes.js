const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');
const { checkApiKey } = require('../middleware/auth');

// Protected Routes
router.use(checkApiKey);

// Backup/Restore
router.get('/', DataController.getAllData);
router.post('/', DataController.restoreData);

// Admin Reset
router.post('/admin/reset', DataController.resetDatabase);
router.delete('/admin/collection/:name', DataController.deleteCollection);

module.exports = router;
