const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');
const { checkJwt } = require('../middleware/auth');

// Public Login
router.post('/login', EmployeeController.login);

// Protected Management
router.get('/', checkJwt, EmployeeController.getEmployees);
router.post('/', checkJwt, EmployeeController.createEmployee);
router.put('/:id', checkJwt, EmployeeController.updateEmployee);
router.delete('/:id', checkJwt, EmployeeController.deleteEmployee);


module.exports = router;
