try {
    require('../models/Ingredient');
    require('../models/MenuItem');
    require('../models/Recipe');
    require('../models/Order');
    require('../controllers/InventoryController');
    require('../controllers/MenuController');
    require('../controllers/OrderController');
    require('../controllers/CustomerController');
    require('../routes/inventoryRoutes');
    console.log('✅ MVC Structure Check Passed: All files found and syntax valid.');
} catch (err) {
    console.error('❌ Check Failed:', err);
    process.exit(1);
}
