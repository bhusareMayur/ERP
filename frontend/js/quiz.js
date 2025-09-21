// ERP Quiz System - Student Quiz JavaScript
const API_BASE = '/api';
const QUIZ_ID = 1;
const STUDENT_ID = 1;

class QuizManager {
    constructor() {
        this.tabSwitchCount = 0;
        this.isQuizSubmitted = false;
        this.attemptId = null;
        
        this.init();
    }

    init() {
        this.loadQuizData();
        this.setupTabSwitchDetection();
        this.setupEventListeners();
    }

    async loadQuizData() {
        try {
            // Load quiz details
            const quizResponse = await fetch(`${API_BASE}/quiz/${QUIZ_ID}`);
            const quiz = await quizResponse.json();
            
            document.getElementById('quizTitle').textContent = quiz.title;

            // Load attempt status
            const statusResponse = await fetch(`${API_BASE}/quiz/${QUIZ_ID}/student/${STUDENT_ID}/status`);
            const status = await statusResponse.json();
            
            this.attemptId = status.attemptId;
            this.tabSwitchCount = status.tabSwitchCount;
            
            this.updateUI(status);
            
        } catch (error) {
            console.error('Error loading quiz data:', error);
            this.showError('Failed to load quiz data');
        }
    }

    updateUI(status) {
        document.getElementById('tabSwitchCount').textContent = status.tabSwitchCount;
        
        if (status.status === 'submitted') {
            this.isQuizSubmitted = true;
            document.getElementById('quizStatus').textContent = 'Submitted';
            document.getElementById('quizStatus').className = 'badge bg-danger';
            document.getElementById('quizContent').style.display = 'none';
            document.getElementById('submittedContent').style.display = 'block';
        } else if (status.status === 'resumed') {
            document.getElementById('quizStatus').textContent = 'Resumed';
            document.getElementById('quizStatus').className = 'badge bg-success';
        }
    }

    setupTabSwitchDetection() {
        // Detect tab switches using visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !this.isQuizSubmitted) {
                this.handleTabSwitch();
            }
        });

        // Detect focus loss (additional protection)
        window.addEventListener('blur', () => {
            if (!this.isQuizSubmitted) {
                this.handleTabSwitch();
            }
        });
    }

    async handleTabSwitch() {
        try {
            const response = await fetch(`${API_BASE}/quiz/${QUIZ_ID}/tab-switch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: STUDENT_ID
                })
            });

            const result = await response.json();
            this.tabSwitchCount = result.tabSwitchCount;
            
            document.getElementById('tabSwitchCount').textContent = this.tabSwitchCount;

            if (result.action === 'warning') {
                this.showTabSwitchWarning();
            } else if (result.action === 'auto_submit') {
                this.handleAutoSubmit(result);
            }

        } catch (error) {
            console.error('Error handling tab switch:', error);
        }
    }

    showTabSwitchWarning() {
        const modal = new bootstrap.Modal(document.getElementById('tabSwitchModal'));
        modal.show();
    }

    handleAutoSubmit(result) {
        this.isQuizSubmitted = true;
        this.attemptId = result.attemptId;
        
        document.getElementById('quizStatus').textContent = 'Auto-Submitted';
        document.getElementById('quizStatus').className = 'badge bg-danger';
        document.getElementById('quizContent').style.display = 'none';
        document.getElementById('submittedContent').style.display = 'block';
        
        this.showError('Quiz was automatically submitted due to multiple tab switches!');
    }

    setupEventListeners() {
        // Submit quiz manually
        document.getElementById('submitQuiz').addEventListener('click', () => {
            this.submitQuiz();
        });

        // Request resume
        document.getElementById('requestResume').addEventListener('click', () => {
            this.requestResume();
        });
    }

    async submitQuiz() {
        try {
            // Here you would normally collect answers and submit
            const answers = this.collectAnswers();
            
            // For demo purposes, we'll just show a success message
            this.showSuccess('Quiz submitted successfully!');
            
        } catch (error) {
            console.error('Error submitting quiz:', error);
            this.showError('Failed to submit quiz');
        }
    }

    collectAnswers() {
        const answers = {};
        
        // Collect radio button answers
        const questions = ['q1', 'q2'];
        questions.forEach(questionName => {
            const selected = document.querySelector(`input[name="${questionName}"]:checked`);
            answers[questionName] = selected ? selected.id : null;
        });
        
        return answers;
    }

    async requestResume() {
        const reason = document.getElementById('resumeReason').value.trim();
        
        if (!reason) {
            this.showError('Please provide a reason for the resume request');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/quiz/${QUIZ_ID}/resume-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: STUDENT_ID,
                    reason: reason
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Resume request submitted successfully! Please wait for teacher approval.');
                document.getElementById('requestResume').disabled = true;
                document.getElementById('requestResume').textContent = 'Request Submitted';
            } else {
                this.showError(result.error || 'Failed to submit resume request');
            }

        } catch (error) {
            console.error('Error requesting resume:', error);
            this.showError('Failed to submit resume request');
        }
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showError(message) {
        this.showAlert(message, 'danger');
    }

    showAlert(message, type) {
        const alertDiv = document.getElementById('resumeRequestStatus');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize quiz manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizManager();
});