// Map functionality for displaying housing projects

document.addEventListener('DOMContentLoaded', function() {
    // Load projects when the page loads
    loadProjects();
    
    // Set up filter event listeners
    setupFilters();
});

function loadProjects(filterStatus = 'all', searchTerm = '') {
    const projects = dataLoader.getProjects();
    const container = document.getElementById('projects-container');
    
    if (!container) return;
    
    // Filter projects based on status and search term
    let filteredProjects = projects;
    
    if (filterStatus !== 'all') {
        filteredProjects = filteredProjects.filter(project => 
            project.status.toLowerCase() === filterStatus.toLowerCase()
        );
    }
    
    if (searchTerm) {
        filteredProjects = filteredProjects.filter(project => 
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    container.innerHTML = '';
    
    if (filteredProjects.length === 0) {
        container.innerHTML = '<p>No projects found matching your criteria.</p>';
        return;
    }
    
    filteredProjects.forEach(project => {
        const projectElement = createProjectElement(project);
        container.appendChild(projectElement);
    });
}

function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.dataset.projectId = project.id;
    
    // Status badge class
    let statusClass = '';
    switch(project.status.toLowerCase()) {
        case 'proposed':
            statusClass = 'status-proposed';
            break;
        case 'approved':
            statusClass = 'status-approved';
            break;
        case 'completed':
            statusClass = 'status-completed';
            break;
        default:
            statusClass = 'status-proposed';
    }
    
    div.innerHTML = `
        <div class="project-header">
            <div class="project-title">${project.name}</div>
            <span class="status-badge ${statusClass}">${formatStatus(project.status)}</span>
        </div>
        <div class="project-address">${project.address}</div>
        <div class="project-details">
            <div class="detail-card">
                <h4>Units</h4>
                <p>${project.units}</p>
            </div>
            <div class="detail-card">
                <h4>Affordability</h4>
                <p>${project.affordability}</p>
            </div>
            <div class="detail-card">
                <h4>Timeline</h4>
                <p>${project.timeline}</p>
            </div>
        </div>
    `;
    
    // Add click event to navigate to project details
    div.addEventListener('click', () => {
        window.location.href = `project.html?id=${project.id}`;
    });
    
    return div;
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function setupFilters() {
    const statusFilter = document.getElementById('status-filter');
    const searchFilter = document.getElementById('search-filter');
    const resetButton = document.getElementById('reset-filters');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            const searchTerm = searchFilter ? searchFilter.value : '';
            loadProjects(status, searchTerm);
        });
    }
    
    if (searchFilter) {
        searchFilter.addEventListener('input', function() {
            const searchTerm = this.value;
            const status = statusFilter ? statusFilter.value : 'all';
            loadProjects(status, searchTerm);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (statusFilter) statusFilter.value = 'all';
            if (searchFilter) searchFilter.value = '';
            loadProjects();
        });
    }
}