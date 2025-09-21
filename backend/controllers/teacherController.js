const db = require('../models/database');

class TeacherController {
    // Get all resume requests
    static async getResumeRequests(req, res) {
        try {
            const [requests] = await db.execute(`
                SELECT 
                    rr.*,
                    s.name as student_name,
                    s.email as student_email,
                    q.title as quiz_title
                FROM resume_requests rr
                JOIN students s ON rr.student_id = s.id
                JOIN quizzes q ON rr.quiz_id = q.id
                ORDER BY rr.created_at DESC
            `);

            res.json(requests);

        } catch (error) {
            console.error('Get resume requests error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get requests summary (counts)
    static async getRequestsSummary(req, res) {
        try {
            const [summary] = await db.execute(`
                SELECT 
                    status,
                    COUNT(*) as count
                FROM resume_requests 
                GROUP BY status
            `);

            // Initialize counts
            const result = {
                pending: 0,
                approved: 0,
                rejected: 0
            };

            // Map database results to result object
            summary.forEach(row => {
                result[row.status] = row.count;
            });

            res.json(result);

        } catch (error) {
            console.error('Get requests summary error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Approve resume request
    static async approveResumeRequest(req, res) {
        try {
            const { id } = req.params;

            // Get the resume request details
            const [requests] = await db.execute(
                'SELECT * FROM resume_requests WHERE id = ?',
                [id]
            );

            if (requests.length === 0) {
                return res.status(404).json({ error: 'Resume request not found' });
            }

            const request = requests[0];

            // Update resume request status
            await db.execute(
                'UPDATE resume_requests SET status = "approved", updated_at = NOW() WHERE id = ?',
                [id]
            );

            // Update quiz attempt status to resumed
            await db.execute(
                'UPDATE quiz_attempts SET status = "resumed" WHERE id = ?',
                [request.attempt_id]
            );

            res.json({
                success: true,
                message: 'Resume request approved successfully'
            });

        } catch (error) {
            console.error('Approve resume request error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Reject resume request
    static async rejectResumeRequest(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            // Update resume request status
            await db.execute(
                'UPDATE resume_requests SET status = "rejected", updated_at = NOW() WHERE id = ?',
                [id]
            );

            res.json({
                success: true,
                message: 'Resume request rejected successfully'
            });

        } catch (error) {
            console.error('Reject resume request error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = TeacherController;