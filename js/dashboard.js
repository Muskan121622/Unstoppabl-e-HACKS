// Dashboard functionality for displaying analytics and stability metrics

document.addEventListener('DOMContentLoaded', function() {
    // Update dashboard metrics
    updateStabilityIndex();
    updateSentimentAnalysis();
    setupDashboardControls();
    // In a full implementation, we would also update charts here
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
    // Simplified calculation for demo purposes
    // In reality, this would be based on:
    // - Affordable unit ratio
    // - Price trend direction
    // - Sentiment score
    // - Zoning compliance
    // - Other factors
    
    // For demo, we'll return a random score between 70-90
    return Math.floor(Math.random() * 21) + 70;
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

function getSimulatedSentimentData() {
    // Return simulated sentiment data
    return {
        positive: 65,
        neutral: 25,
        negative: 10
    };
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