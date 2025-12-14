// Dashboard functionality for displaying analytics and stability metrics

document.addEventListener('DOMContentLoaded', function () {
    // Check if data is already loaded
    if (window.dataLoader && window.dataLoader.getProjects().length > 0) {
        initDashboard();
    } else {
        // Wait for data load
        document.addEventListener('HSHP:DataLoaded', initDashboard);
    }

    setupDashboardControls();
});

function initDashboard() {
    console.log('Initializing dashboard with real data...');
    updateStabilityIndex();
    updateSentimentAnalysis();
    updateComplianceStats();
    updatePriceTrendChart();
}

function updateStabilityIndex() {
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

        // Update progress bar
        const progressBar = document.querySelector('.stability-index .progress-fill');
        if (progressBar) {
            progressBar.style.width = `${stabilityScore}%`;
            progressBar.className = `progress-fill ${stabilityScore >= 80 ? 'good' : (stabilityScore >= 60 ? 'warning' : 'critical')}`;
        }
    }
}

function calculateStabilityScore() {
    const projects = window.dataLoader.getProjects();
    const feedback = window.dataLoader.getAllFeedback();

    if (!projects.length) return 0;

    // 1. Compliance Score (30%)
    const approvedProjects = projects.filter(p => p.status === 'approved' || p.status === 'completed').length;
    const complianceRate = approvedProjects / projects.length;
    const complianceScore = complianceRate * 30;

    // 2. Sentiment Score (30%)
    let sentimentScore = 15; // Start neutral
    if (feedback.length > 0) {
        const positives = feedback.filter(f => f.sentiment === 'positive').length;
        const negatives = feedback.filter(f => f.sentiment === 'negative').length;
        const netSentiment = (positives - negatives) / feedback.length; // -1 to 1
        sentimentScore = 15 + (netSentiment * 15);
    }

    // 3. Housing Supply Score (20%)
    // More affordable units = better stability logic for this program
    const totalUnits = projects.reduce((sum, p) => sum + (p.units || 0), 0);
    const supplyScore = Math.min(20, (totalUnits / 500) * 20); // Cap at 500 units for max score

    // 4. Base Stability (20%)
    const baseScore = 20;

    let score = baseScore + complianceScore + sentimentScore + supplyScore;
    return Math.round(Math.max(0, Math.min(100, score)));
}

function updateSentimentAnalysis() {
    const feedback = window.dataLoader.getAllFeedback();

    let positive = 0, neutral = 0, negative = 0;

    if (feedback.length > 0) {
        feedback.forEach(f => {
            if (f.sentiment === 'positive') positive++;
            else if (f.sentiment === 'negative') negative++;
            else neutral++;
        });

        // Convert to percentages
        const total = feedback.length;
        positive = Math.round((positive / total) * 100);
        negative = Math.round((negative / total) * 100);
        // Ensure they add up to 100 approximately, put remainder in neutral
        neutral = 100 - positive - negative;
    }

    const positiveElement = document.getElementById('positive-sentiment');
    const neutralElement = document.getElementById('neutral-sentiment');
    const negativeElement = document.getElementById('negative-sentiment');

    if (positiveElement) positiveElement.textContent = `${positive}%`;
    if (neutralElement) neutralElement.textContent = `${neutral}%`;
    if (negativeElement) negativeElement.textContent = `${negative}%`;
}

function updateComplianceStats() {
    const projects = window.dataLoader.getProjects();
    const totalProjects = projects.length;

    if (totalProjects === 0) return;

    const approvedProjects = projects.filter(p => p.status === 'approved' || p.status === 'completed').length;
    const pendingProjects = projects.filter(p => p.status === 'proposed').length;

    const complianceRate = Math.round((approvedProjects / totalProjects) * 100);

    // Update DOM elements
    const complianceElement = document.getElementById('compliance-rate');
    const pendingElement = document.getElementById('pending-reviews');
    const violationsElement = document.getElementById('violations-count');

    if (complianceElement) complianceElement.textContent = `${complianceRate}%`;
    if (pendingElement) pendingElement.textContent = pendingProjects;
    if (violationsElement) violationsElement.textContent = 0; // Placeholder as we don't track hard violations in JSON yet

    // Update progress bar width
    const progressBar = document.querySelector('.dashboard-card .progress-fill');
    // Note: The selector above might target the first card (Stability) if not careful. 
    // Let's use ID or specific context.

    const complianceCard = complianceElement?.closest('.dashboard-card');
    if (complianceCard) {
        const bar = complianceCard.querySelector('.progress-fill.good'); // Assuming initial class
        if (bar) {
            bar.style.width = `${complianceRate}%`;
            // Color logic
            if (complianceRate >= 80) {
                bar.className = 'progress-fill good';
            } else if (complianceRate >= 60) {
                bar.className = 'progress-fill warning';
            } else {
                bar.className = 'progress-fill critical';
            }
        }
    }
}

function updatePriceTrendChart() {
    if (!window.utils || !window.utils.generateBarChart) return;

    const trends = window.dataLoader.getPriceTrends();
    if (!trends || trends.length === 0) return;

    // Transform for utils.generateBarChart
    // Check if the container exists and replace the image with a div for various bars
    const container = document.querySelector('.chart-container');
    if (container) {
        // Clear the image
        container.innerHTML = '';
        container.id = 'price-trend-chart';
        container.style.alignItems = 'flex-end'; // Align bars to bottom
        container.style.padding = '20px';
        container.style.height = '300px';

        const chartData = trends.map(t => ({
            label: t.year.toString(),
            value: t.avg_price,
            color: '#3498db'
        }));

        window.utils.generateBarChart(chartData, 'price-trend-chart');
    }
}

function setupDashboardControls() {
    const exportButton = document.getElementById('export-data');
    const refreshButton = document.getElementById('refresh-dashboard');

    if (exportButton) {
        exportButton.addEventListener('click', function () {
            // Export all data
            const exportData = {
                projects: window.dataLoader.getProjects(),
                feedback: window.dataLoader.getAllFeedback(),
                trends: window.dataLoader.getPriceTrends()
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "hshp_dashboard_export.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            showNotification('Data exported successfully!', 'success');
        });
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', function () {
            // Force reload data? Or just re-render
            // Ideally we'd re-fetch, but for now re-render
            initDashboard();
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
    updateSentimentAnalysis,
    updateComplianceStats
};