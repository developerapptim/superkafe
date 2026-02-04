const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Recipe = require('./models/Recipe');
const Ingredient = require('./models/Ingredient');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const fetchData = async () => {
    await connectDB();

    const data = {};
    data.menus = await MenuItem.find().limit(3);
    data.recipes = await Recipe.find().limit(3);
    data.ingredients = await Ingredient.find().limit(3);

    const fs = require('fs');
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log("Data written to data.json");

    process.exit();
};

fetchData();
