// Project details page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (projectId) {
        loadProjectDetails(projectId);
    } else {
        // Handle case where no project ID is provided
        document.getElementById('project-name').textContent = 'Project Not Found';
        document.getElementById('project-status').textContent = 'Error';
    }
    
    // Set up project controls
    setupProjectControls();
});

function loadProjectDetails(projectId) {
    const project = dataLoader.getProjectById(projectId);
    
    if (!project) {
        document.getElementById('project-name').textContent = 'Project Not Found';
        document.getElementById('project-status').textContent = 'Error';
        return;
    }
    
    // Update project header
    document.getElementById('project-name').textContent = project.name;
    
    // Update status badge
    const statusElement = document.getElementById('project-status');
    statusElement.textContent = formatStatus(project.status);
    
    // Add appropriate class for styling
    statusElement.className = 'status-badge ' + getStatusClass(project.status);
    
    // Update project metadata
    document.getElementById('project-location').textContent = project.address;
    document.getElementById('project-units').textContent = project.units;
    document.getElementById('project-affordability').textContent = project.affordability;
    document.getElementById('project-timeline').textContent = project.timeline;
    
    // Update project description
    document.getElementById('project-description').textContent = project.description;
    
    // Update zoning compliance
    updateZoningInfo(project);
    
    // Update value impact
    updateValueImpact(project);
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'proposed':
            return 'status-proposed';
        case 'approved':
            return 'status-approved';
        case 'completed':
            return 'status-completed';
        default:
            return 'status-proposed';
    }
}

function updateZoningInfo(project) {
    // In a real implementation, this would check actual zoning rules
    // For this demo, we'll simulate the data
    
    // Simulate zoning data
    const zoningResult = zoningChecker.checkZoningCompliance(project);
    
    const resultElement = document.getElementById('zoning-result');
    if (zoningResult.compliant) {
        resultElement.textContent = 'Project complies with all zoning requirements';
        resultElement.className = 'zoning-result zoning-pass';
    } else {
        resultElement.textContent = 'Project violates zoning requirements: ' + zoningResult.violations.join(', ');
        resultElement.className = 'zoning-result zoning-fail';
    }
    
    // Update specific zoning values (simulated)
    document.getElementById('far-allowed').textContent = '2.5';
    document.getElementById('far-proposed').textContent = '2.1';
    document.getElementById('height-allowed').textContent = '40ft';
    document.getElementById('height-proposed').textContent = '35ft';
    document.getElementById('density-allowed').textContent = '15 units/acre';
    document.getElementById('density-proposed').textContent = '12 units/acre';
}

function updateValueImpact(project) {
    // Calculate value impact
    const impact = valueEstimator.calculateValueImpact(project);
    
    // Update value display
    document.getElementById('before-value').textContent = utils.formatCurrency(impact.before);
    document.getElementById('after-value').textContent = utils.formatCurrency(impact.after);
    
    // Update bars (as percentage of max value for visualization)
    const maxValue = Math.max(impact.before, impact.after) * 1.1; // Add 10% for spacing
    const beforeHeight = (impact.before / maxValue) * 100;
    const afterHeight = (impact.after / maxValue) * 100;
    
    document.getElementById('before-bar').style.height = beforeHeight + '%';
    document.getElementById('after-bar').style.height = afterHeight + '%';
    
    // Update change percentage
    const changeElement = document.createElement('p');
    changeElement.innerHTML = `<strong>Projected Change:</strong> ${impact.changePercent}%`;
    changeElement.style.marginTop = '1rem';
    changeElement.style.fontWeight = 'bold';
    
    // Insert after the note paragraph
    const noteParagraph = document.querySelector('.section p em').parentNode;
    noteParagraph.parentNode.insertBefore(changeElement, noteParagraph.nextSibling);
}

function setupProjectControls() {
    const exportButton = document.getElementById('export-project');
    const shareButton = document.getElementById('share-project');
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            showNotification('Project data exported successfully!');
        });
    }
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            showNotification('Project shared successfully!');
        });
    }
}

function showNotification(message) {
    const notification = document.getElementById('project-notification');
    if (notification) {
        notification.textContent = message;
        notification.className = 'notification show success';
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}