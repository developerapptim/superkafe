/**
 * Reset Air Panas Stock
 * Run: node scripts/reset-air-panas.js
 */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/warkop')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

const IngredientSchema = new mongoose.Schema({
    id: String,
    nama: String,
    stok: Number
}, { strict: false });

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

async function resetStock() {
    const NEW_STOCK = 19000; // 1 galon = 19000 ml

    const result = await Ingredient.findOneAndUpdate(
        { id: 'ing_mkcoaoy439jyn4fmwlt' }, // Air Panas ID
        { $set: { stok: NEW_STOCK } },
        { new: true }
    );

    if (result) {
        console.log(`✅ Stok Air Panas berhasil di-RESET ke ${NEW_STOCK} ml`);
        console.log(`   Sebelumnya: ~20.93 ml`);
        console.log(`   Sekarang: ${result.stok} ml`);
    } else {
        console.log('❌ Ingredient Air Panas tidak ditemukan');
    }

    process.exit(0);
}

resetStock();
