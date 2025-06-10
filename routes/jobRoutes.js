const express = require('express');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Only employer/admin can post a job
router.post('/post', authMiddleware(), jobController.createJob);

// Anyone authenticated can list jobs
router.get('/list',  jobController.listJobs);

module.exports = router;
