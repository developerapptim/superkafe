const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/InventoryController');
const { checkApiKey } = require('../middleware/auth');

router.use(checkApiKey);

router.get('/', InventoryController.getGramasi);
router.post('/', InventoryController.addGramasi);
router.post('/bulk', InventoryController.addGramasiBulk);
router.delete('/:id', InventoryController.deleteGramasi);

module.exports = router;
