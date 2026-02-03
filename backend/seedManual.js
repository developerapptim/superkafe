require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pastikan bcryptjs terinstall

// 1. KONEKSI KE DATABASE ANDA (Sesuai data yang Anda kirim tadi)
const uri = "mongodb+srv://developerapptim:developerapptim1@cluster0.6ifoomz.mongodb.net/?appName=Cluster0";

// 2. DATA YANG AKAN DISUNTIK
const users = [
    { username: "admin", password: "password", name: "Admin", role: "admin" },
    { username: "kasir", password: "123456", name: "Kasir", role: "Staff" }
];

const categories = [
    { id: "kopi", name: "Kopi", slug: "kopi" },
    { id: "non-kopi", name: "Non Kopi", "slug": "non-kopi" },
    { id: "makanan", name: "Makanan", "slug": "makanan" }
];

// 3. SKEMA SEDERHANA
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    name: String,
    role: String
});
const categorySchema = new mongoose.Schema({ id: String, name: String, slug: String });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

async function seed() {
    try {
        console.log("⏳ Menghubungkan ke MongoDB Cloud...");
        await mongoose.connect(uri);
        console.log("✅ Terhubung!");

        // BERSIHKAN DATA LAMA (Opsional)
        await User.deleteMany({});
        await Category.deleteMany({});

        // HASH PASSWORD & INSERT USER
        console.log("⏳ Menyuntikkan data Admin...");
        for (let u of users) {
            const salt = await bcrypt.genSalt(10);
            u.password = await bcrypt.hash(u.password, salt);
            await User.create(u);
        }

        // INSERT KATEGORI
        await Category.insertMany(categories);

        console.log("🎉 SUKSES! Data Admin & Kategori sudah masuk.");
        console.log("👉 Silakan Login sekarang: admin / password");
        process.exit(0);
    } catch (error) {
        console.error("❌ Gagal:", error);
        process.exit(1);
    }
}

seed();