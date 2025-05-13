// Existing script code...

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Check if hamburger element exists (for pages that include the mobile menu)
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            document.getElementById('menu').classList.toggle('active');
        });
    }

    // Resources page functionality
    // Only initialize if we're on the resources page
    if (document.querySelector('.resources-grid')) {
        initializeResourcesPage();
    }

    // Page transition effect
    window.addEventListener('pageshow', function() {
        document.body.classList.remove('page-transition');
    });
    
    window.addEventListener('beforeunload', function() {
        document.body.classList.add('page-transition');
    });

    // Hamburger menu functionality
    const hamburgerOld = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburgerOld && navMenu) {
        hamburgerOld.addEventListener('click', function() {
            hamburgerOld.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when nav link is clicked
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', function() {
                hamburgerOld.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
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
