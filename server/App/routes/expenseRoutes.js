const express = require('express');
const router = express.Router();
const { addExpense, updateExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.post('/add', protect, addExpense);    // http://localhost:5000/api/expenses/add
router.put('/update/:id', protect, updateExpense);    // http://localhost:5000/api/expenses/update/:id
router.get('/get', protect, getExpenses);    // http://localhost:5000/api/expenses/get
router.delete('/delete/:id', protect, deleteExpense);    // http://localhost:5000/api/expenses/delete/:id

module.exports = router;
