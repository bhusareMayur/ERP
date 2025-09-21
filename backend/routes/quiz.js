const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/quizController');

// Handle tab switch
router.post('/:quizId/tab-switch', QuizController.handleTabSwitch);

// Create resume request
router.post('/:quizId/resume-request', QuizController.createResumeRequest);

// Get quiz details
router.get('/:quizId', QuizController.getQuizDetails);

// Get attempt status
router.get('/:quizId/student/:studentId/status', QuizController.getAttemptStatus);

module.exports = router;