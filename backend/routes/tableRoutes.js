const express = require('express');
const router = express.Router();
const TableController = require('../controllers/TableController'); // Using legacy controller for now
const { checkApiKey } = require('../middleware/auth');

router.use(checkApiKey);

router.get('/', TableController.getTables);
router.post('/', TableController.addTable);
router.patch('/:id/status', TableController.updateStatus);
router.delete('/:id', TableController.deleteTable);

// New features
router.post('/:fromId/move/:toId', TableController.moveTable);
router.patch('/:id/clean', TableController.cleanTable);

module.exports = router;
