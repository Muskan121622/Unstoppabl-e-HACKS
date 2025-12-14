// Project details page functionality

document.addEventListener('DOMContentLoaded', function () {
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
    // Load project from projects.json
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const project = Array.isArray(projects) ? projects.find(p => p.id == projectId) : projects;
            window.currentProject = project;

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
            document.getElementById('project-location').textContent = project.area || 'Not specified';
            document.getElementById('project-units').textContent = project.totalUnits;
            document.getElementById('project-affordability').textContent = `${Math.round((project.affordableUnits / project.totalUnits) * 100)}%`;
            document.getElementById('project-timeline').textContent = '2025-2027'; // Default timeline

            // Update project description
            document.getElementById('project-description').textContent = `This is the ${project.name} housing project located in ${project.area}. The project includes ${project.totalUnits} units with ${project.affordableUnits} affordable units.`;

            // Update zoning compliance
            updateZoningInfo(project);

            // Update value impact
            updateValueImpact(project);

            // Update TIF calculator defaults
            updateTIFDefaults(project);

            // Load project documents
            loadProjectDocuments(project);
        })
        .catch(error => {
            console.error('Error loading project:', error);
            document.getElementById('project-name').textContent = 'Error Loading Project';
            document.getElementById('project-status').textContent = 'Error';
        });

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
    switch (status.toLowerCase()) {
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
    // Get actual zoning data from JSON
    fetch('data/zoning.json')
        .then(response => response.json())
        .then(zoning => {
            // Update specific zoning values from data
            document.getElementById('far-allowed').textContent = zoning.far;
            document.getElementById('far-proposed').textContent = project.units > 100 ? '2.1' : '1.5';
            document.getElementById('height-allowed').textContent = zoning.heightLimit;
            document.getElementById('height-proposed').textContent = project.units > 100 ? '35ft' : '25ft';
            document.getElementById('density-allowed').textContent = `${zoning.maxUnits} units/acre`;
            document.getElementById('density-proposed').textContent = `${project.units} units/acre`;

            // Check compliance
            const isCompliant = (
                parseFloat(document.getElementById('far-proposed').textContent) <= zoning.far &&
                document.getElementById('height-proposed').textContent.replace('ft', '') <= parseInt(zoning.heightLimit) &&
                project.units <= zoning.maxUnits
            );

            const resultElement = document.getElementById('zoning-result');
            if (isCompliant) {
                resultElement.textContent = 'Project complies with all zoning requirements';
                resultElement.className = 'zoning-result zoning-pass';
            } else {
                resultElement.textContent = 'Project may have zoning concerns - please review regulations';
                resultElement.className = 'zoning-result zoning-fail';
            }

            // Feature 4: Zoning Simulator Logic
            const simResult = document.getElementById('zoning-sim-result');
            if (simResult) {
                if (project.units > zoning.maxUnits) {
                    simResult.textContent = "Zoning Conflict";
                    simResult.style.color = "#d9534f"; // Red
                } else {
                    simResult.textContent = "Zoning OK";
                    simResult.style.color = "#5cb85c"; // Green
                }
            }
        })
        .catch(error => console.error('Error loading zoning data:', error));
}

function updateValueImpact(project) {
    // Calculate value impact
    valueEstimator.calculateValueImpact(project).then(impact => {
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
        let changeElement = document.getElementById('projected-change');
        if (!changeElement) {
            changeElement = document.createElement('p');
            changeElement.id = 'projected-change';
            changeElement.style.marginTop = '1rem';
            changeElement.style.fontWeight = 'bold';

            // Insert after the note paragraph
            const noteParagraph = document.querySelector('.section p em').parentNode;
            noteParagraph.parentNode.insertBefore(changeElement, noteParagraph.nextSibling);
        }
        changeElement.innerHTML = `<strong>Projected Change:</strong> ${impact.changePercent}%`;

        // Update PDF link
        if (impact.sourcePdf) {
            const link = document.getElementById('circle-rate-link');
            if (link) link.href = impact.sourcePdf;
        }
    }).catch(error => {
        console.error('Error updating value impact:', error);
        document.getElementById('before-value').textContent = 'Error';
        document.getElementById('after-value').textContent = 'Error';
    });
}

function setupProjectControls() {
    const exportButton = document.getElementById('export-project');
    const shareButton = document.getElementById('share-project');

    if (exportButton) {
        exportButton.addEventListener('click', function () {
            if (!window.currentProject) {
                showNotification('Still loading project data...');
                return;
            }

            // Create data blob
            const dataStr = JSON.stringify(window.currentProject, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            // Create phantom link
            const exportFileDefaultName = `project-${window.currentProject.id}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            showNotification('Project data downloading...');
        });
    }

    if (shareButton) {
        shareButton.addEventListener('click', function () {
            // Copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard!');
            }).catch(err => {
                console.error('Could not copy text: ', err);
                showNotification('Failed to copy link.');
            });
        });
    }
}

function loadProjectDocuments(project) {
    // Get documents based on project name
    const docContainer = document.getElementById('document-list');
    if (!docContainer) return;

    // Clear existing content
    docContainer.innerHTML = '<p>Loading documents...</p>';

    // Fetch documents from our generated JSON
    fetch('data/documents.json')
        .then(response => response.json())
        .then(documents => {
            // Filter documents for this project
            const projectDocs = documents.filter(doc =>
                doc.project === project.name ||
                (doc.project === 'Sector 104 Development' && (project.name === 'Tathastu I' || project.name === 'Tathastu II')) // Special case for shared docs
            );

            docContainer.innerHTML = '';

            if (projectDocs.length === 0) {
                docContainer.innerHTML = '<p>No documents available for this project.</p>';
                return;
            }

            // Sort by type
            projectDocs.sort((a, b) => a.type.localeCompare(b.type));

            projectDocs.forEach(doc => {
                const link = document.createElement('a');
                link.href = doc.path;
                link.target = '_blank';
                link.className = 'doc-link';
                link.innerHTML = `<strong>${doc.type}:</strong> ${doc.filename}`;

                const item = document.createElement('div');
                item.className = 'doc-item';
                item.appendChild(link);

                // Add excerpt if available
                if (doc.excerpt && doc.excerpt.trim().length > 0) {
                    const excerpt = document.createElement('p');
                    excerpt.className = 'doc-excerpt';
                    excerpt.style.fontSize = '0.85rem';
                    excerpt.style.color = '#666';
                    excerpt.style.marginTop = '4px';
                    excerpt.style.marginBottom = '8px';
                    excerpt.style.fontStyle = 'italic';

                    // Truncate if too long (though we already truncated in python)
                    const displayText = doc.excerpt.length > 200 ? doc.excerpt.substring(0, 200) + '...' : doc.excerpt;
                    excerpt.textContent = displayText;
                    item.appendChild(excerpt);
                }

                docContainer.appendChild(item);
            });
        })
        .catch(error => {
            console.error('Error loading documents:', error);
            docContainer.innerHTML = '<p>Error loading documents.</p>';
        });
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

function updateTIFDefaults(project) {
    // Get circle rate data
    fetch('data/prices.json')
        .then(response => response.json())
        .then(priceData => {
            if (priceData && priceData.circleRate) {
                const valueInput = document.getElementById('tif-property-value');
                if (valueInput) {
                    // Set value based on circle rate * generic size (e.g. 1000 sq ft) or just use circle rate as base
                    // Use a realistic project value. If circle rate is per sq yard/meter, and we don't have area, 
                    // we'll assume a standard unit size or just use the raw circle rate if it looks like a total value.
                    // Looking at prices.json: "circleRate": 7800. This is small, likely per sq ft.
                    // Let's assume 1000 sq ft unit.
                    const unitSize = 1000;
                    valueInput.value = priceData.circleRate * unitSize;

                    // Trigger calculation
                    if (window.tifCalculator) {
                        window.tifCalculator.updateView();
                    }
                }
            }
        })
        .catch(err => console.error('Error setting TIF defaults:', err));
}