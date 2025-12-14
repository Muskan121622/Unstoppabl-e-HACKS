// Data Loader - Handles loading and managing static JSON data

// Global variables to store loaded data
let projectsData = [];
let zoningData = {};
let priceData = {};
let feedbackData = [];

// Load all data when the script is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Function to load all JSON data
function loadData() {
    // In a real implementation, we would fetch JSON files
    // For this demo, we'll use the static data we defined earlier
    
    // Projects data
    projectsData = [
        {
            id: 1,
            name: "Riverside Affordable Housing",
            status: "approved",
            address: "123 Main St",
            units: 120,
            affordability: "30%",
            timeline: "2025-2027",
            description: "This mixed-income development will provide affordable housing options while maintaining the character of the neighborhood. The project includes energy-efficient buildings, community spaces, and sustainable landscaping.",
            coordinates: { lat: 40.7128, lng: -74.0060 },
            developer: "Community Housing Partners",
            funding: "Federal & State Grants"
        },
        {
            id: 2,
            name: "Downtown Senior Living",
            status: "completed",
            address: "456 Oak Ave",
            units: 80,
            affordability: "50%",
            timeline: "2023-2025",
            description: "A dedicated senior living facility with healthcare services and recreational amenities. Designed to support aging in place with accessible features throughout.",
            coordinates: { lat: 40.7215, lng: -74.0112 },
            developer: "Senior Living Solutions",
            funding: "Private Investment"
        },
        {
            id: 3,
            name: "Uptown Family Housing",
            status: "proposed",
            address: "789 Pine St",
            units: 200,
            affordability: "40%",
            timeline: "2026-2029",
            description: "A family-oriented housing complex featuring playgrounds, educational facilities, and community gardens. Focus on creating a vibrant neighborhood for families of all incomes.",
            coordinates: { lat: 40.7352, lng: -74.0231 },
            developer: "Urban Family Developments",
            funding: "Public-Private Partnership"
        },
        {
            id: 4,
            name: "Westside Student Housing",
            status: "approved",
            address: "321 Elm Blvd",
            units: 150,
            affordability: "35%",
            timeline: "2025-2027",
            description: "Affordable housing specifically designed for college students and young professionals. Includes study spaces, bike storage, and public transit access.",
            coordinates: { lat: 40.7011, lng: -74.0123 },
            developer: "Campus Housing Group",
            funding: "University Partnership"
        }
    ];
    
    // Zoning data
    zoningData = {
        "residential-a": {
            name: "Residential A District",
            far: 0.5,
            height: 35,
            density: 8,
            description: "Low-density residential district with single-family homes"
        },
        "residential-b": {
            name: "Residential B District",
            far: 1.0,
            height: 45,
            density: 12,
            description: "Medium-density residential district allowing duplexes and small apartment buildings"
        },
        "mixed-use": {
            name: "Mixed-Use District",
            far: 2.5,
            height: 60,
            density: 20,
            description: "High-density district allowing residential and commercial uses"
        }
    };
    
    // Price data
    priceData = {
        "trends": [
            { year: 2020, avg_price: 320000 },
            { year: 2021, avg_price: 335000 },
            { year: 2022, avg_price: 342000 },
            { year: 2023, avg_price: 348000 },
            { year: 2024, avg_price: 352000 },
            { year: 2025, avg_price: 355000 }
        ],
        "impact": {
            "before": 350000,
            "after": 355000,
            "change_percent": 1.4
        }
    };
    
    // Feedback data
    feedbackData = [
        {
            id: 1,
            projectId: 1,
            text: "I'm excited to see more affordable options in our neighborhood. This project seems well-designed.",
            author: "Sarah Johnson",
            date: "2025-03-15",
            sentiment: "positive"
        },
        {
            id: 2,
            projectId: 1,
            text: "Concerned about increased traffic but willing to give it a chance. Hope there will be adequate parking.",
            author: "Michael Chen",
            date: "2025-03-10",
            sentiment: "neutral"
        },
        {
            id: 3,
            projectId: 1,
            text: "Don't want this in my neighborhood. It will decrease property values and bring crime.",
            author: "Robert Williams",
            date: "2025-03-05",
            sentiment: "negative"
        },
        {
            id: 4,
            projectId: 2,
            text: "The senior living facility has been a wonderful addition to our community. My parents love it here.",
            author: "Jennifer Lee",
            date: "2025-04-01",
            sentiment: "positive"
        },
        {
            id: 5,
            projectId: 3,
            text: "Looking forward to this family-friendly development. Will it include a daycare?",
            author: "David Martinez",
            date: "2025-03-20",
            sentiment: "neutral"
        }
    ];
}

// Utility functions for data access
function getProjects() {
    return projectsData;
}

function getProjectById(id) {
    return projectsData.find(project => project.id === parseInt(id));
}

function getZoningRules(district) {
    return zoningData[district] || null;
}

function getPriceTrends() {
    return priceData.trends;
}

function getPriceImpact() {
    return priceData.impact;
}

function getFeedbackByProjectId(projectId) {
    return feedbackData.filter(feedback => feedback.projectId === parseInt(projectId));
}

function getAllFeedback() {
    return feedbackData;
}

function getProjectsByStatus(status) {
    return projectsData.filter(project => project.status === status);
}

function searchProjects(query) {
    return projectsData.filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.address.toLowerCase().includes(query.toLowerCase())
    );
}

// Export functions for use in other modules
window.dataLoader = {
    getProjects,
    getProjectById,
    getZoningRules,
    getPriceTrends,
    getPriceImpact,
    getFeedbackByProjectId,
    getAllFeedback,
    getProjectsByStatus,
    searchProjects
};