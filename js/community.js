// Community page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Load discussions when the page loads
    loadDiscussions();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up filter event listeners
    setupFilters();
});

// Sample discussion data
const discussionsData = [
    {
        id: 1,
        title: "How do affordable housing projects affect property values?",
        content: "I'm concerned about the potential impact on my home's value. Can anyone share data or studies on this topic?",
        author: "Jane Smith",
        date: "2025-05-10",
        topic: "property-values",
        answers: 12,
        tags: ["property-values", "research"]
    },
    {
        id: 2,
        title: "What are the zoning requirements for new developments?",
        content: "I'd like to understand the zoning process for affordable housing projects in our area. Where can I find this information?",
        author: "Robert Johnson",
        date: "2025-05-08",
        topic: "zoning",
        answers: 8,
        tags: ["zoning", "regulations"]
    },
    {
        id: 3,
        title: "Community impact of the Riverside project",
        content: "Has anyone experienced changes in their neighborhood since the Riverside project was completed? I'm curious about traffic and noise levels.",
        author: "Maria Garcia",
        date: "2025-05-05",
        topic: "community-impact",
        answers: 15,
        tags: ["community-impact", "traffic", "noise"]
    },
    {
        id: 4,
        title: "How long does the development process take?",
        content: "I'm trying to understand the timeline for affordable housing projects. What are the typical stages and how long does each take?",
        author: "David Wilson",
        date: "2025-05-03",
        topic: "development-process",
        answers: 6,
        tags: ["development-process", "timeline"]
    },
    {
        id: 5,
        title: "Are there plans for more projects in our area?",
        content: "I've heard rumors about additional affordable housing projects. Is there a master plan we can review?",
        author: "Sarah Thompson",
        date: "2025-05-01",
        topic: "development-process",
        answers: 4,
        tags: ["development-process", "planning"]
    }
];

function loadDiscussions(filterTopic = 'all', sortBy = 'recent') {
    const container = document.getElementById('discussions-container');
    
    if (!container) return;
    
    // Filter discussions
    let filteredDiscussions = discussionsData;
    
    if (filterTopic !== 'all') {
        filteredDiscussions = filteredDiscussions.filter(discussion => 
            discussion.topic === filterTopic
        );
    }
    
    // Sort discussions
    switch(sortBy) {
        case 'popular':
            filteredDiscussions.sort((a, b) => b.answers - a.answers);
            break;
        case 'answered':
            filteredDiscussions.sort((a, b) => 
                (b.answers > 0 ? 1 : 0) - (a.answers > 0 ? 1 : 0) || 
                new Date(b.date) - new Date(a.date)
            );
            break;
        case 'recent':
        default:
            filteredDiscussions.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }
    
    container.innerHTML = '';
    
    if (filteredDiscussions.length === 0) {
        container.innerHTML = '<p>No discussions found matching your criteria.</p>';
        return;
    }
    
    filteredDiscussions.forEach(discussion => {
        const discussionElement = createDiscussionElement(discussion);
        container.appendChild(discussionElement);
    });
}

function createDiscussionElement(discussion) {
    const div = document.createElement('div');
    div.className = 'discussion-card';
    div.dataset.discussionId = discussion.id;
    
    // Format date
    const formattedDate = new Date(discussion.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    div.innerHTML = `
        <div class="discussion-header">
            <h3 class="discussion-title">${discussion.title}</h3>
        </div>
        <div class="discussion-content">
            <p>${discussion.content}</p>
        </div>
        <div class="discussion-footer">
            <div class="discussion-meta">
                <span>By ${discussion.author}</span>
                <span>${formattedDate}</span>
            </div>
            <div class="discussion-tags">
                ${discussion.tags.map(tag => `<span class="topic-tag">${tag.replace('-', ' ')}</span>`).join('')}
            </div>
            <div class="answer-count">
                ${discussion.answers} ${discussion.answers === 1 ? 'answer' : 'answers'}
            </div>
        </div>
    `;
    
    return div;
}

function setupEventListeners() {
    // Ask question button
    const askButton = document.getElementById('ask-question');
    if (askButton) {
        askButton.addEventListener('click', function() {
            showModal('question-modal');
        });
    }
    
    // Share experience button
    const shareButton = document.getElementById('share-experience');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            showModal('experience-modal');
        });
    }
    
    // Close modals
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Cancel buttons
    const cancelQuestion = document.getElementById('cancel-question');
    if (cancelQuestion) {
        cancelQuestion.addEventListener('click', function() {
            hideModal('question-modal');
        });
    }
    
    const cancelExperience = document.getElementById('cancel-experience');
    if (cancelExperience) {
        cancelExperience.addEventListener('click', function() {
            hideModal('experience-modal');
        });
    }
    
    // Submit forms
    const questionForm = document.getElementById('question-form');
    if (questionForm) {
        questionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitQuestion();
        });
    }
    
    const experienceForm = document.getElementById('experience-form');
    if (experienceForm) {
        experienceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitExperience();
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
}

function setupFilters() {
    const topicFilter = document.getElementById('topic-filter');
    const sortFilter = document.getElementById('sort-filter');
    const resetButton = document.getElementById('reset-filters');
    
    if (topicFilter) {
        topicFilter.addEventListener('change', function() {
            const topic = this.value;
            const sortBy = sortFilter ? sortFilter.value : 'recent';
            loadDiscussions(topic, sortBy);
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            const sortBy = this.value;
            const topic = topicFilter ? topicFilter.value : 'all';
            loadDiscussions(topic, sortBy);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (topicFilter) topicFilter.value = 'all';
            if (sortFilter) sortFilter.value = 'recent';
            loadDiscussions();
        });
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function submitQuestion() {
    // In a real implementation, this would submit the question
    showNotification('Question submitted successfully!');
    hideModal('question-modal');
    
    // Reset form
    const form = document.getElementById('question-form');
    if (form) {
        form.reset();
    }
}

function submitExperience() {
    // In a real implementation, this would submit the experience
    showNotification('Experience shared successfully!');
    hideModal('experience-modal');
    
    // Reset form
    const form = document.getElementById('experience-form');
    if (form) {
        form.reset();
    }
}

function showNotification(message) {
    const notification = document.getElementById('community-notification');
    if (notification) {
        notification.textContent = message;
        notification.className = 'notification show success';
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}