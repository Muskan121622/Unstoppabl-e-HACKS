// Utility functions for the HSHP application

// Format currency values
function formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
}

// Format percentages
function formatPercentage(value) {
    return `${value}%`;
}

// Format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate a simple chart using HTML/CSS (for demo purposes)
function generateBarChart(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Find max value for scaling
    const maxValue = Math.max(...data.map(item => item.value));

    // Create bars
    data.forEach(item => {
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${(item.value / maxValue) * 100}%`;
        bar.style.backgroundColor = item.color || '#3498db';

        const label = document.createElement('div');
        label.className = 'chart-label';
        label.textContent = item.label;

        const value = document.createElement('div');
        value.className = 'chart-value';
        value.textContent = item.value;

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        barContainer.appendChild(value);

        container.appendChild(barContainer);
    });
}

// Simple DOM manipulation utilities
function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}

// Get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Export utilities
window.utils = {
    formatCurrency,
    formatPercentage,
    formatDate,
    generateBarChart,
    createElement,
    getUrlParameter
};