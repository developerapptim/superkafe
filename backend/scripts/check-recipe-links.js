/**
 * Diagnostic Script: Check Recipe-Ingredient Links
 * Run: node scripts/check-recipe-links.js
 */

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/warkop')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

// Define Schemas (simplified)
const MenuItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    use_stock_check: Boolean,
    is_active: Boolean
}, { strict: false });

const RecipeSchema = new mongoose.Schema({
    menuId: String,
    ingredients: [{
        ing_id: String,
        jumlah: Number
    }]
}, { strict: false });

const IngredientSchema = new mongoose.Schema({
    id: String,
    nama: String,
    stok: Number
}, { strict: false });

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
const Recipe = mongoose.model('Recipe', RecipeSchema);
const Ingredient = mongoose.model('Ingredient', IngredientSchema);

async function diagnose() {
    console.log('\n========== DIAGNOSTIK STOK MENU ==========\n');

    // 1. Get all menu items
    const menus = await MenuItem.find();
    console.log(`📋 Total Menu Items: ${menus.length}`);

    // 2. Get all recipes
    const recipes = await Recipe.find();
    console.log(`📖 Total Recipes: ${recipes.length}`);

    // 3. Get all ingredients
    const ingredients = await Ingredient.find();
    console.log(`🧪 Total Ingredients: ${ingredients.length}`);

    // Build ingredient map
    const ingredientMap = new Map();
    ingredients.forEach(ing => {
        ingredientMap.set(String(ing.id), { nama: ing.nama, stok: ing.stok });
    });

    console.log('\n--- INGREDIENT IDs ---');
    ingredients.forEach(ing => {
        console.log(`  [${ing.id}] ${ing.nama} = ${ing.stok}`);
    });

    // Build recipe map
    const recipeMap = new Map();
    recipes.forEach(r => {
        recipeMap.set(String(r.menuId), r.ingredients);
    });

    console.log('\n--- MENU & RECIPE CHECK ---');

    for (const menu of menus) {
        const menuId = String(menu.id);
        const recipe = recipeMap.get(menuId);

        console.log(`\n🍽️  Menu: "${menu.name}" (ID: ${menuId})`);
        console.log(`    use_stock_check: ${menu.use_stock_check}`);
        console.log(`    is_active: ${menu.is_active}`);

        if (!recipe || recipe.length === 0) {
            console.log(`    ⚠️  NO RECIPE FOUND! Stock will be 9999 (unlimited) or based on manual stock.`);
            continue;
        }

        console.log(`    📖 Recipe has ${recipe.length} ingredient(s):`);

        let minPortions = Infinity;
        let hasIssue = false;

        for (const ri of recipe) {
            const ingKey = String(ri.ing_id);
            const ingData = ingredientMap.get(ingKey);

            if (!ingData) {
                console.log(`       ❌ [${ri.ing_id}] NOT FOUND IN INGREDIENTS! (needed: ${ri.jumlah})`);
                hasIssue = true;
                minPortions = 0;
            } else {
                const portions = ri.jumlah > 0 ? Math.floor(ingData.stok / ri.jumlah) : Infinity;
                console.log(`       ✅ [${ri.ing_id}] ${ingData.nama}: ${ingData.stok} / ${ri.jumlah} = ${portions} portions`);
                if (portions < minPortions) minPortions = portions;
            }
        }

        if (hasIssue) {
            console.log(`    🔴 RESULT: Stock = 0 (missing ingredient link!)`);
        } else {
            console.log(`    🟢 RESULT: Available Stock = ${minPortions === Infinity ? 'Unlimited' : minPortions}`);
        }
    }

    console.log('\n========== END DIAGNOSTIK ==========\n');
    process.exit(0);
}

diagnose();
