// ERP Quiz System - Teacher Dashboard JavaScript
const API_BASE = '/api';

class TeacherDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        // Refresh data every 30 seconds
        setInterval(() => this.loadDashboardData(), 30000);
    }

    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadRequestsSummary(),
                this.loadResumeRequests()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    async loadRequestsSummary() {
        try {
            const response = await fetch(`${API_BASE}/teacher/requests-summary`);
            const summary = await response.json();
            
            document.getElementById('approvedCount').textContent = summary.approved || 0;
            document.getElementById('pendingCount').textContent = summary.pending || 0;
            document.getElementById('rejectedCount').textContent = summary.rejected || 0;
            
        } catch (error) {
            console.error('Error loading requests summary:', error);
        }
    }

    async loadResumeRequests() {
        try {
            const response = await fetch(`${API_BASE}/teacher/resume-requests`);
            const requests = await response.json();
            
            this.renderRequestsTable(requests);
            
        } catch (error) {
            console.error('Error loading resume requests:', error);
            this.showError('Failed to load resume requests');
        }
    }

    renderRequestsTable(requests) {
        const tableBody = document.getElementById('requestsTableBody');
        const emptyState = document.getElementById('emptyState');
        
        if (requests.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        tableBody.innerHTML = requests.map(request => `
            <tr>
                <td>${request.id}</td>
                <td>
                    <strong>${request.student_name}</strong><br>
                    <small class="text-muted">${request.student_email}</small>
                </td>
                <td>${request.quiz_title}</td>
                <td>
                    <span title="${request.reason}">${this.truncateText(request.reason, 50)}</span>
                </td>
                <td>
                    <span class="badge status-${request.status}">${this.capitalizeFirst(request.status)}</span>
                </td>
                <td>
                    <small>${this.formatDate(request.created_at)}</small>
                </td>
                <td>
                    ${this.renderActionButtons(request)}
                </td>
            </tr>
        `).join('');
    }

    renderActionButtons(request) {
        if (request.status === 'pending') {
            return `
                <div class="btn-group" role="group">
                    <button class="btn btn-success btn-sm" onclick="teacherDashboard.approveRequest(${request.id})">
                        <i class="bi bi-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="teacherDashboard.rejectRequest(${request.id})">
                        <i class="bi bi-x"></i> Reject
                    </button>
                </div>
            `;
        } else {
            const badgeClass = request.status === 'approved' ? 'bg-success' : 'bg-danger';
            const icon = request.status === 'approved' ? 'check-circle' : 'x-circle';
            return `<span class="badge ${badgeClass}"><i class="bi bi-${icon}"></i> ${this.capitalizeFirst(request.status)}</span>`;
        }
    }

    setupEventListeners() {
        // Modal event listeners are handled by the onclick attributes in the HTML
    }

    approveRequest(requestId) {
        this.showConfirmation(
            'Approve Resume Request',
            'Are you sure you want to approve this resume request? The student will be able to continue their quiz.',
            'Approve',
            'btn-success',
            () => this.performApproveRequest(requestId)
        );
    }

    rejectRequest(requestId) {
        this.showConfirmation(
            'Reject Resume Request',
            'Are you sure you want to reject this resume request? The student will not be able to resume their quiz.',
            'Reject',
            'btn-danger',
            () => this.performRejectRequest(requestId)
        );
    }

    async performApproveRequest(requestId) {
        try {
            const response = await fetch(`${API_BASE}/teacher/resume-requests/${requestId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Resume request approved successfully');
                this.loadDashboardData(); // Refresh data
            } else {
                this.showError(result.error || 'Failed to approve request');
            }

        } catch (error) {
            console.error('Error approving request:', error);
            this.showError('Failed to approve request');
        }
    }

    async performRejectRequest(requestId) {
        try {
            const response = await fetch(`${API_BASE}/teacher/resume-requests/${requestId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Resume request rejected successfully');
                this.loadDashboardData(); // Refresh data
            } else {
                this.showError(result.error || 'Failed to reject request');
            }

        } catch (error) {
            console.error('Error rejecting request:', error);
            this.showError('Failed to reject request');
        }
    }

    showConfirmation(title, message, actionText, actionClass, callback) {
        document.getElementById('confirmationModalTitle').textContent = title;
        document.getElementById('confirmationModalBody').textContent = message;
        
        const confirmBtn = document.getElementById('confirmActionBtn');
        confirmBtn.textContent = actionText;
        confirmBtn.className = `btn ${actionClass}`;
        
        // Remove existing event listeners and add new one
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', () => {
            callback();
            bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
        });
        
        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        toast.style.minWidth = '300px';
        toast.innerHTML = `
            <strong>${type === 'success' ? 'Success!' : 'Error!'}</strong> ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }

    // Utility functions
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }
}

// Initialize teacher dashboard when DOM is loaded
let teacherDashboard;
document.addEventListener('DOMContentLoaded', () => {
    teacherDashboard = new TeacherDashboard();
});