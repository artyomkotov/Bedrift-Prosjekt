// Existing script code...

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when nav link is clicked
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
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
