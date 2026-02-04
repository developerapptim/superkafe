const data = require('./data.json');
const menuId = "menu_1769841451110_xww96p07q";
const menu = data.menus.find(m => m.id === menuId);
console.log("Menu found:", menu);
