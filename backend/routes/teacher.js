const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacherController');

// Get all resume requests
router.get('/resume-requests', TeacherController.getResumeRequests);

// Get requests summary
router.get('/requests-summary', TeacherController.getRequestsSummary);

// Approve resume request
router.post('/resume-requests/:id/approve', TeacherController.approveResumeRequest);

// Reject resume request
router.post('/resume-requests/:id/reject', TeacherController.rejectResumeRequest);

module.exports = router;