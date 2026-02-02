const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { checkJwt } = require('../middleware/auth');

// Protected Routes
router.put('/change-password', checkJwt, UserController.changePassword);

module.exports = router;
