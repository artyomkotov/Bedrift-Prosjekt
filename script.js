// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    // Hamburger menu logic for all pages
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    if (hamburger && navMenu) {
        // Toggle menu open/close on burger click
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        // Close menu when a nav link is clicked (for mobile UX)
        navMenu.querySelectorAll('li a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    document.querySelectorAll('a').forEach(link => {
    // Only handle internal links (exclude external)
    if (link.hostname === window.location.hostname) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = link.getAttribute('href');
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = href;
            }, 300); // Match to your CSS transition time
        });
    }
});

    // Resources page functionality
    // Only initialize if we're on the resources page
    if (document.querySelector('.resources-grid')) {
        initializeResourcesPage();
    }

    
    // Chat input functionality
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Function to redirect to chat page
    function redirectToChat() {
        if (userInput && userInput.value.trim() !== '') {
            // Save the user's input to sessionStorage to display in the chat page
            sessionStorage.setItem('initialMessage', userInput.value.trim());
            // Redirect to chat page with a fade transition
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = 'chat.html';
            }, 300);
        }
    }

    // Add event listener for Enter key
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                redirectToChat();
            }
        });
    }

    // Add event listener for Send button
    if (sendButton) {
        sendButton.addEventListener('click', redirectToChat);
    }

    // Also add event listener for the Get Started button
    const getStartedBtn = document.getElementById('getStarted');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = 'chat.html';
            }, 300);
        });
    }
});

function initializeResourcesPage() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    const resourceCards = document.querySelectorAll('.resource-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const searchInput = document.getElementById('resourceSearch');
    const searchButton = document.getElementById('searchButton');
    const noResults = document.getElementById('noResults');

    // Filter function
    function filterResources() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        
        let hasVisibleCards = false;
        
        resourceCards.forEach(card => {
            const cardCategories = card.dataset.categories.split(',');
            const cardContent = card.textContent.toLowerCase();
            
            // Check if card matches both category and search term
            const matchesCategory = activeCategory === 'all' || cardCategories.includes(activeCategory);
            const matchesSearch = searchTerm === '' || cardContent.includes(searchTerm);
            
            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                hasVisibleCards = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show or hide no results message
        if (hasVisibleCards) {
            noResults.classList.remove('visible');
        } else {
            noResults.classList.add('visible');
        }
    }
    
    // Category button click handler
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter resources
            filterResources();
        });
    });
    
    // Search functionality
    searchButton.addEventListener('click', filterResources);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterResources();
        }
    });

    // Initial filter
    filterResources();
}
