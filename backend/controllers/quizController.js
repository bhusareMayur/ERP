const db = require('../models/database');

class QuizController {
    // Handle tab switch event and auto-submit logic
    static async handleTabSwitch(req, res) {
        try {
            const { quizId } = req.params;
            const { studentId } = req.body;

            // Log the tab switch
            await db.execute(
                'INSERT INTO quiz_tab_switches (quiz_id, student_id) VALUES (?, ?)',
                [quizId, studentId]
            );

            // Get current quiz attempt
            const [attempts] = await db.execute(
                'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? AND status = "in_progress"',
                [quizId, studentId]
            );

            if (attempts.length === 0) {
                return res.status(404).json({ error: 'No active quiz attempt found' });
            }

            const attempt = attempts[0];

            // Count tab switches for this attempt
            const [switchCount] = await db.execute(
                'SELECT COUNT(*) as count FROM quiz_tab_switches WHERE quiz_id = ? AND student_id = ?',
                [quizId, studentId]
            );

            const tabSwitchCount = switchCount[0].count;

            // Update attempt with current tab switch count
            await db.execute(
                'UPDATE quiz_attempts SET tab_switch_count = ? WHERE id = ?',
                [tabSwitchCount, attempt.id]
            );

            // Auto-submit if more than 4 tab switches
            if (tabSwitchCount >= 4) {
                await db.execute(
                    'UPDATE quiz_attempts SET status = "submitted", submitted_at = NOW() WHERE id = ?',
                    [attempt.id]
                );

                return res.json({
                    action: 'auto_submit',
                    message: 'Quiz auto-submitted due to multiple tab switches',
                    tabSwitchCount,
                    attemptId: attempt.id
                });
            }

            // Show warning on first tab switch
            if (tabSwitchCount === 2) {
                return res.json({
                    action: 'warning',
                    message: 'Warning: Switching tabs is not allowed. Next switch will auto-submit your quiz.',
                    tabSwitchCount
                });
            }

            res.json({
                action: 'logged',
                message: 'Tab switch logged',
                tabSwitchCount
            });

        } catch (error) {
            console.error('Tab switch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Create resume request
    static async createResumeRequest(req, res) {
        try {
            const { quizId } = req.params;
            const { studentId, reason } = req.body;

            // Find the submitted attempt
            const [attempts] = await db.execute(
                'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? AND status = "submitted"',
                [quizId, studentId]
            );

            if (attempts.length === 0) {
                return res.status(404).json({ error: 'No submitted quiz attempt found' });
            }

            const attempt = attempts[0];

            // Check if resume request already exists
            const [existingRequests] = await db.execute(
                'SELECT * FROM resume_requests WHERE attempt_id = ? AND status = "pending"',
                [attempt.id]
            );

            if (existingRequests.length > 0) {
                return res.status(400).json({ error: 'Resume request already pending' });
            }

            // Create resume request
            const [result] = await db.execute(
                'INSERT INTO resume_requests (quiz_id, student_id, attempt_id, reason) VALUES (?, ?, ?, ?)',
                [quizId, studentId, attempt.id, reason || 'No reason provided']
            );

            res.json({
                success: true,
                message: 'Resume request submitted successfully',
                requestId: result.insertId
            });

        } catch (error) {
            console.error('Resume request error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get quiz details
    static async getQuizDetails(req, res) {
        try {
            const { quizId } = req.params;

            const [quizzes] = await db.execute(
                'SELECT * FROM quizzes WHERE id = ?',
                [quizId]
            );

            if (quizzes.length === 0) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            res.json(quizzes[0]);

        } catch (error) {
            console.error('Get quiz error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get current attempt status
    static async getAttemptStatus(req, res) {
        try {
            const { quizId, studentId } = req.params;

            const [attempts] = await db.execute(
                'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ? ORDER BY created_at DESC LIMIT 1',
                [quizId, studentId]
            );

            if (attempts.length === 0) {
                // Create new attempt
                const [result] = await db.execute(
                    'INSERT INTO quiz_attempts (quiz_id, student_id) VALUES (?, ?)',
                    [quizId, studentId]
                );

                return res.json({
                    attemptId: result.insertId,
                    status: 'in_progress',
                    tabSwitchCount: 0
                });
            }

            const attempt = attempts[0];

            // Get tab switch count
            const [switchCount] = await db.execute(
                'SELECT COUNT(*) as count FROM quiz_tab_switches WHERE quiz_id = ? AND student_id = ?',
                [quizId, studentId]
            );

            res.json({
                attemptId: attempt.id,
                status: attempt.status,
                tabSwitchCount: switchCount[0].count,
                submittedAt: attempt.submitted_at
            });

        } catch (error) {
            console.error('Get attempt status error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = QuizController;