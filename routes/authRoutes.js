const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route to register a new company
router.post('/register', authController.register);

// Route to login a company
router.post('/login', authController.login);

// Route to logout (fix: use router, not app)
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);



router.post('/verifyOtp', authController.verifyOtp);

router.post('/google/register', authController.directRegister);

router.post('/google/login', authController.directLogin);

module.exports = router;
