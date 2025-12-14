// Dashboard functionality for displaying analytics and stability metrics

document.addEventListener('DOMContentLoaded', function() {
    // Update dashboard metrics
    updateStabilityIndex();
    updateSentimentAnalysis();
    updateComplianceStats();
    setupDashboardControls();
});

function updateStabilityIndex() {
    // Calculate stability index based on various factors
    // In a real implementation, this would use actual data
    // For this demo, we'll use a simulated value
    
    const stabilityScore = calculateStabilityScore();
    const scoreElement = document.getElementById('stability-score');
    
    if (scoreElement) {
        scoreElement.textContent = stabilityScore;
        
        // Add color coding based on score
        if (stabilityScore >= 80) {
            scoreElement.style.color = '#2ecc71'; // Green
        } else if (stabilityScore >= 60) {
            scoreElement.style.color = '#f39c12'; // Orange
        } else {
            scoreElement.style.color = '#e74c3c'; // Red
        }
    }
}

function calculateStabilityScore() {
    // Calculate stability score based on actual data
    const projects = dataLoader.getProjects();
    const totalProjects = projects.length;
    const approvedProjects = projects.filter(p => p.status === 'approved').length;
    const complianceRate = approvedProjects / totalProjects || 0;
    
    // Base score with weighting
    const baseScore = 50;
    const complianceScore = complianceRate * 30;
    const sentimentData = getSimulatedSentimentData();
    const sentimentScore = (sentimentData.positive - sentimentData.negative) * 0.5;
    
    let score = baseScore + complianceScore + sentimentScore;
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    return Math.round(score);
}

function updateSentimentAnalysis() {
    // In a real implementation, this would analyze actual feedback
    // For this demo, we'll use simulated data
    
    const sentimentData = getSimulatedSentimentData();
    
    const positiveElement = document.getElementById('positive-sentiment');
    const neutralElement = document.getElementById('neutral-sentiment');
    const negativeElement = document.getElementById('negative-sentiment');
    
    if (positiveElement) positiveElement.textContent = `${sentimentData.positive}%`;
    if (neutralElement) neutralElement.textContent = `${sentimentData.neutral}%`;
    if (negativeElement) negativeElement.textContent = `${sentimentData.negative}%`;
}

function updateComplianceStats() {
    const projects = dataLoader.getProjects();
    const totalProjects = projects.length;
    const approvedProjects = projects.filter(p => p.status === 'approved').length;
    const complianceRate = totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0;
    
    // Update DOM elements
    const complianceElement = document.getElementById('compliance-rate');
    const pendingElement = document.getElementById('pending-reviews');
    const violationsElement = document.getElementById('violations-count');
    
    if (complianceElement) complianceElement.textContent = `${complianceRate}%`;
    if (pendingElement) pendingElement.textContent = totalProjects - approvedProjects;
    if (violationsElement) violationsElement.textContent = 0; // No actual violation checking in this demo
    
    // Update progress bar width
    const progressBar = document.querySelector('.progress-fill.good');
    if (progressBar) {
        progressBar.style.width = `${complianceRate}%`;
        // Change color based on value
        if (complianceRate >= 80) {
            progressBar.className = 'progress-fill good';
        } else if (complianceRate >= 60) {
            progressBar.className = 'progress-fill warning';
        } else {
            progressBar.className = 'progress-fill critical';
        }
    }
}

function setupDashboardControls() {
    const exportButton = document.getElementById('export-data');
    const refreshButton = document.getElementById('refresh-dashboard');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // In a real implementation, this would export data
            showNotification('Data exported successfully!', 'success');
        });
    }
    
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            // Refresh dashboard data
            updateStabilityIndex();
            updateSentimentAnalysis();
            showNotification('Dashboard refreshed successfully!', 'success');
        });
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('dashboard-notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Export for use in other modules
window.dashboard = {
    updateStabilityIndex,
    updateSentimentAnalysis
};