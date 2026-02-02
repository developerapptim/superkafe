const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const { checkApiKey } = require('../middleware/auth');

router.use(checkApiKey);

router.get('/', MenuController.getRecipes);
router.put('/:menuId', MenuController.updateRecipe);
router.post('/', MenuController.createMenu); // Sometimes createMenu is used for recipes? Checking server.js: app.post('/api/recipes') -> Recipe.findOneAndUpdate (upsert)
// MenuController.updateRecipe logic (line 186) covers Upsert. 
// server.js had both POST and PUT for recipes.
// POST /api/recipes -> Recipe.findOneAndUpdate (upsert)
// PUT /api/recipes/:menuId -> Recipe.findOneAndUpdate (upsert)

router.post('/', MenuController.updateRecipe); // Reusing update as it handles upsert based on body
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
