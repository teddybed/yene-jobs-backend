const express = require('express');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /post - Only 'employer' or 'admin' roles can post a job
router.post('/post', authMiddleware(['employer', 'admin']), jobController.createJob);

// GET /list/:industry - Anyone can list jobs, no auth needed
router.get('/list/:industry', jobController.listJobs);

module.exports = router;
