/**
 * Migration Script: Standardize Phone Numbers
 * Converts all 08xxx phone numbers to 62xxx format
 * 
 * Usage: node scripts/migrate-phone-format.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/warkop';

// Order Schema (minimal for migration)
const OrderSchema = new mongoose.Schema({
    id: String,
    customerName: String,
    customerPhone: String,
    customer_phone: String, // Legacy field
}, { strict: false });

const Order = mongoose.model('Order', OrderSchema);

// Phone formatter
const formatPhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') return null;
    let cleaned = phone.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 9) return null;
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
    if (!cleaned.startsWith('62') && cleaned.length >= 9) cleaned = '62' + cleaned;
    return cleaned.length >= 11 ? cleaned : null;
};

async function migratePhoneNumbers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!\n');

        // Find orders with phone numbers starting with 0
        const orders = await Order.find({
            $or: [
                { customerPhone: { $regex: /^0/, $exists: true, $ne: null } },
                { customer_phone: { $regex: /^0/, $exists: true, $ne: null } }
            ]
        });

        console.log(`Found ${orders.length} orders with 08xxx phone format\n`);

        if (orders.length === 0) {
            console.log('No migration needed - all phones already in 62xxx format!');
            process.exit(0);
        }

        let updated = 0;
        let skipped = 0;

        for (const order of orders) {
            const updates = {};

            // Check customerPhone field
            if (order.customerPhone && order.customerPhone.startsWith('0')) {
                const formatted = formatPhoneNumber(order.customerPhone);
                if (formatted) {
                    updates.customerPhone = formatted;
                }
            }

            // Check legacy customer_phone field
            if (order.customer_phone && order.customer_phone.startsWith('0')) {
                const formatted = formatPhoneNumber(order.customer_phone);
                if (formatted) {
                    updates.customer_phone = formatted;
                }
            }

            if (Object.keys(updates).length > 0) {
                await Order.updateOne({ _id: order._id }, { $set: updates });
                console.log(`✓ Order ${order.id}: ${order.customerPhone || order.customer_phone} → ${updates.customerPhone || updates.customer_phone}`);
                updated++;
            } else {
                skipped++;
            }
        }

        console.log(`\n✅ Migration Complete!`);
        console.log(`   Updated: ${updated} orders`);
        console.log(`   Skipped: ${skipped} orders`);

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

// Run migration
migratePhoneNumbers();
