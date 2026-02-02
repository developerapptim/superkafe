const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/warkop')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        resetStock();
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

const IngredientSchema = new mongoose.Schema({
    id: String,
    nama: String,
    stok: Number
}, { strict: false });

const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);

async function resetStock() {
    try {
        const targetId = 'ing_mkcoaoy439jyn4fmwlt';
        const NEW_STOCK = 19000;

        console.log(`🔍 Searching for Ingredient ID: ${targetId}...`);

        const item = await Ingredient.findOne({ id: targetId });

        if (!item) {
            console.error('❌ Ingredient NOT FOUND!');
            process.exit(1);
        }

        console.log(`ℹ️ Current Stock: ${item.stok}`);

        item.stok = NEW_STOCK;
        await item.save();

        console.log(`✅ SUCCESS! Stock updated to ${NEW_STOCK}`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating stock:', error);
        process.exit(1);
    }
}
