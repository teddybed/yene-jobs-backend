const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route to register a new company
router.post('/register', authController.register);

// Route to login a company
router.post('/login', authController.login);

router.post('/verifyOtp', authController.verifyOtp);


router.post('/google/register', authController.directRegister);

router.post('/google/login', authController.directLogin);






module.exports = router;
