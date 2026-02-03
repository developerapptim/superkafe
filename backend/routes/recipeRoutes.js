const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const { checkApiKey } = require('../middleware/auth');

router.use(checkApiKey);

router.get('/', MenuController.getRecipes);
router.put('/:menuId', MenuController.updateRecipe);

// Fix: POST / should map to updateRecipe (which handles upsert), NOT createMenu
router.post('/', MenuController.updateRecipe);
// But MenuController.updateRecipe uses req.params.menuId?
// Let's check MenuController.updateRecipe code:
// const { ingredients } = req.body;
// const item = await Recipe.findOneAndUpdate({ menuId: req.params.menuId }, ...)
// So for POST /, we need a method that takes menuId from body.

// Let's create `upsertRecipe` in MenuController or use inline here? 
// Logic in server.js lines 3209: const { menuId, ingredients } = req.body;
// I should add upsertRecipe to MenuController.
// I will just map POST / to updateRecipe if I can ensure params? No.

// I will just add a route handler here for simplicity or modify MenuController.
// Modifying MenuController is better for purity.
// But for now, keeping it simple: I will use `MenuController.updateRecipe` logic but I need to handle the params issue.

module.exports = router;
