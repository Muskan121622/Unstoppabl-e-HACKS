// Community sentiment voting and feedback handling

// Initialize localStorage for votes and feedback if not present
function initializeStorage() {
    if (!localStorage.getItem('projectVotes')) {
        localStorage.setItem('projectVotes', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('projectFeedback')) {
        localStorage.setItem('projectFeedback', JSON.stringify([]));
    }
}

// Get votes for a project
function getVotes(projectId) {
    initializeStorage();
    const votes = JSON.parse(localStorage.getItem('projectVotes'));
    return votes[projectId] || { upvotes: 0, downvotes: 0 };
}

// Record a vote for a project
function recordVote(projectId, voteType) {
    initializeStorage();
    const votes = JSON.parse(localStorage.getItem('projectVotes'));
    
    if (!votes[projectId]) {
        votes[projectId] = { upvotes: 0, downvotes: 0 };
    }
    
    if (voteType === 'up') {
        votes[projectId].upvotes++;
    } else if (voteType === 'down') {
        votes[projectId].downvotes++;
    }
    
    localStorage.setItem('projectVotes', JSON.stringify(votes));
    updateVoteDisplay(projectId);
}

// Add feedback for a project
function addFeedback(projectId, text) {
    if (!text.trim()) return;
    
    initializeStorage();
    const feedbackList = JSON.parse(localStorage.getItem('projectFeedback'));
    
    const newFeedback = {
        id: Date.now(), // Simple ID generation
        projectId: projectId,
        text: text,
        author: "Community Member",
        date: new Date().toISOString().split('T')[0],
        sentiment: analyzeSentiment(text)
    };
    
    feedbackList.push(newFeedback);
    localStorage.setItem('projectFeedback', JSON.stringify(feedbackList));
    
    displayFeedback(projectId);
}

// Simple sentiment analysis (for demo purposes)
function analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'love', 'support', 'excited', 'happy', 'positive'];
    const negativeWords = ['bad', 'terrible', 'hate', 'worst', 'dislike', 'concerned', 'negative', 'awful'];
    
    const textLower = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (textLower.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (textLower.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
}

// Update vote display on page
function updateVoteDisplay(projectId) {
    const votes = getVotes(projectId);
    
    const upvoteElement = document.getElementById('upvote-count');
    const downvoteElement = document.getElementById('downvote-count');
    
    if (upvoteElement) upvoteElement.textContent = votes.upvotes;
    if (downvoteElement) downvoteElement.textContent = votes.downvotes;
}

// Display feedback for a project
function displayFeedback(projectId) {
    const feedbackContainer = document.getElementById('feedback-container');
    if (!feedbackContainer) return;
    
    initializeStorage();
    const allFeedback = JSON.parse(localStorage.getItem('projectFeedback'));
    const projectFeedback = allFeedback.filter(item => item.projectId == projectId);
    
    feedbackContainer.innerHTML = '';
    
    if (projectFeedback.length === 0) {
        feedbackContainer.innerHTML = '<p>No feedback yet. Be the first to share your thoughts!</p>';
        return;
    }
    
    projectFeedback.forEach(item => {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-item';
        feedbackElement.innerHTML = `
            <p>${item.text}</p>
            <div class="feedback-meta">
                By ${item.author} on ${item.date}
            </div>
        `;
        feedbackContainer.appendChild(feedbackElement);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get project ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (projectId) {
        // Set up vote buttons
        const upvoteBtn = document.querySelector('.upvote');
        const downvoteBtn = document.querySelector('.downvote');
        
        if (upvoteBtn) {
            upvoteBtn.addEventListener('click', () => recordVote(projectId, 'up'));
        }
        
        if (downvoteBtn) {
            downvoteBtn.addEventListener('click', () => recordVote(projectId, 'down'));
        }
        
        // Set up feedback form
        const feedbackForm = document.getElementById('feedback-text');
        const submitBtn = document.getElementById('submit-feedback');
        
        if (submitBtn && feedbackForm) {
            submitBtn.addEventListener('click', () => {
                addFeedback(projectId, feedbackForm.value);
                feedbackForm.value = ''; // Clear the form
            });
        }
        
        // Initial display update
        updateVoteDisplay(projectId);
        displayFeedback(projectId);
    }
});