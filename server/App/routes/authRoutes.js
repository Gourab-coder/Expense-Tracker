const express = require('express');
const {signup, login} = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/authValidation');

const router = express.Router();

router.post('/login', loginValidation, login);   // http://localhost:5000/api/auth/login
router.post('/signup', signupValidation, signup);   // http://localhost:5000/api/auth/signup

module.exports = router;
