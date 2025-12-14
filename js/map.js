// Map functionality using Leaflet

let map;
let markers = [];

document.addEventListener('DOMContentLoaded', function () {
    initMap();

    // Listen for data loaded event (if data loader is used)
    document.addEventListener('HSHP:DataLoaded', function () {
        loadProjects('all', '');
    });

    // Also try to load immediately if data is already available
    if (window.dataLoader && window.dataLoader.getProjects().length > 0) {
        loadProjects('all', '');
    }

    setupFilters();
});

function initMap() {
    // Initialize map centered on Gurugram
    map = L.map('map').setView([28.4595, 77.0266], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function loadProjects(status = 'all', searchTerm = '') {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Get projects from data loader
    const projects = window.dataLoader.getProjects();
    const container = document.getElementById('projects-container');
    if (container) container.innerHTML = '';

    if (projects.length === 0) {
        if (container) container.innerHTML = '<p>Loading projects...</p>';
        return;
    }

    let visibleCount = 0;

    projects.forEach(project => {
        // Filter logic
        if (status !== 'all' && project.status.toLowerCase() !== status.toLowerCase()) return;
        if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) && !project.area.toLowerCase().includes(searchTerm.toLowerCase())) return;

        // Add marker if lat/lng exist
        if (project.lat && project.lng) {
            const marker = L.marker([project.lat, project.lng])
                .bindPopup(`
                    <b>${project.name}</b><br>
                    ${project.area}<br>
                    Status: ${project.status}<br>
                    <a href="project.html?id=${project.id}">View Details</a>
                `)
                .addTo(map);
            markers.push(marker);
        }

        // Add to list
        if (container) {
            container.appendChild(createProjectElement(project));
        }
        visibleCount++;
    });

    if (visibleCount === 0 && container) {
        container.innerHTML = '<p>No projects match your filters.</p>';
    }
}

function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.dataset.projectId = project.id;

    // Status badge class
    let statusClass = '';
    switch (project.status.toLowerCase()) {
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
        <div class="project-address">${project.area}</div>
        <div class="project-details">
            <div class="detail-card">
                <h4>Units</h4>
                <p>${project.totalUnits}</p>
            </div>
            <div class="detail-card">
                <h4>Affordable</h4>
                <p>${project.affordableUnits}</p>
            </div>
            <div class="detail-card">
                <h4>Timeline</h4>
                <p>2025-2027</p>
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
        statusFilter.addEventListener('change', function () {
            const status = this.value;
            const searchTerm = searchFilter ? searchFilter.value : '';
            loadProjects(status, searchTerm);
        });
    }

    if (searchFilter) {
        searchFilter.addEventListener('input', function () {
            const searchTerm = this.value;
            const status = statusFilter ? statusFilter.value : 'all';
            loadProjects(status, searchTerm);
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', function () {
            if (statusFilter) statusFilter.value = 'all';
            if (searchFilter) searchFilter.value = '';
            loadProjects('all', '');
        });
    }
}
