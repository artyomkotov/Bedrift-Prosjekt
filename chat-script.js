document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu for responsive design
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    const chatSidebar = document.querySelector('.chat-sidebar');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (chatSidebar) {
                chatSidebar.classList.toggle('active');
            }
        });
    }
    
    // Chat functionality
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const newChatBtn = document.getElementById('newChatBtn');
    
    // DeepSeek API configuration
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';  // Replace with actual API endpoint
    const DEEPSEEK_API_KEY = 'sk-a96766c985f848d1a4031696c0c8e247';  // Replace with your actual API key
    
    // Custom instructions for the AI - only set in code
    const CUSTOM_AI_INSTRUCTIONS = `
        You are Pathfinder AI, a helpful coding assistant that specializes in teaching programming concepts.
        
        When responding to queries:
        1. Use markdown formatting for code examples (triple backticks with language name)
        2. Use **bold** for important concepts
        3. Use *italics* for emphasis
        4. Structure your response with clear headings and bullet points
        5. If providing code, always explain how it works line by line
        6. Keep your explanations beginner-friendly but technically accurate
        7. When relevant, provide links to official documentation
        
        Your goal is to help users understand programming concepts deeply rather than just providing quick solutions.
    `;
    
    // Initialize chat history from localStorage
    let chats = loadChats();
    let currentChatId = localStorage.getItem('currentChatId');
    
    // If no current chat, create a new one
    if (!currentChatId || !chats[currentChatId]) {
        createNewChat();
    } else {
        // Load the current chat
        loadChat(currentChatId);
    }
    
    // Check if there's an initial message from the landing page
    const initialMessage = sessionStorage.getItem('initialMessage');
    if (initialMessage) {
        // Add the user's initial message
        addMessage(initialMessage, 'user');
        
        // Save to chat history
        saveMessage(initialMessage, 'user');
        
        // Clear it from sessionStorage
        sessionStorage.removeItem('initialMessage');
        
        // Get AI response
        getAIResponse(initialMessage);
    }
    
    // Function to load chats from localStorage
    function loadChats() {
        const savedChats = localStorage.getItem('pathfinderChats');
        return savedChats ? JSON.parse(savedChats) : {};
    }
    
    // Function to save chats to localStorage
    function saveChats(chats) {
        localStorage.setItem('pathfinderChats', JSON.stringify(chats));
    }
    
    // Function to create a new chat
    function createNewChat() {
        const chatId = 'chat_' + Date.now();
        currentChatId = chatId;
        
        // Initialize the chat with the welcome message
        chats[chatId] = {
            title: 'New Chat',
            messages: [{
                content: "Hello! I'm Pathfinder AI, your coding assistant. How can I help you with your coding journey today?",
                sender: 'ai',
                timestamp: Date.now()
            }]
        };
        
        // Save to localStorage
        localStorage.setItem('currentChatId', chatId);
        saveChats(chats);
        
        // Clear the chat UI and show welcome message
        chatMessages.innerHTML = '';
        addMessage(chats[chatId].messages[0].content, 'ai');
        
        // Update the sidebar
        updateChatSidebar();
    }
    
    // Function to load a specific chat
    function loadChat(chatId) {
        currentChatId = chatId;
        localStorage.setItem('currentChatId', chatId);
        
        // Update UI with chat messages
        chatMessages.innerHTML = '';
        const chat = chats[chatId];
        
        if (chat && chat.messages) {
            chat.messages.forEach(msg => {
                addMessage(msg.content, msg.sender);
            });
        }
        
        // Update sidebar active state
        updateActiveChatInSidebar(chatId);
    }
    
    // Function to save a message to the current chat
    function saveMessage(content, sender) {
        if (!chats[currentChatId]) {
            createNewChat();
        }
        
        chats[currentChatId].messages.push({
            content: content,
            sender: sender,
            timestamp: Date.now()
        });
        
        // Update chat title if it's the first user message
        if (sender === 'user' && chats[currentChatId].messages.filter(m => m.sender === 'user').length === 1) {
            // Use first 20 chars of message as chat title
            chats[currentChatId].title = content.substring(0, 20) + (content.length > 20 ? '...' : '');
            updateChatSidebar();
        }
        
        saveChats(chats);
    }
    
    // Function to update the chat sidebar
    function updateChatSidebar() {
        const historyContainer = document.querySelector('.chat-history');
        if (!historyContainer) return;
        
        historyContainer.innerHTML = '';
        
        // Sort chats by most recent message
        const sortedChatIds = Object.keys(chats).sort((a, b) => {
            const aLastMsg = chats[a].messages[chats[a].messages.length - 1].timestamp;
            const bLastMsg = chats[b].messages[chats[b].messages.length - 1].timestamp;
            return bLastMsg - aLastMsg;
        });
        
        // Add each chat to the sidebar
        sortedChatIds.forEach(chatId => {
            const chat = chats[chatId];
            const isActive = chatId === currentChatId;
            
            const chatItem = document.createElement('div');
            chatItem.className = `history-item ${isActive ? 'active' : ''}`;
            chatItem.dataset.chatId = chatId;
            chatItem.innerHTML = `
                <span>${chat.title}</span>
                <button class="delete-chat" data-chat-id="${chatId}">×</button>
            `;
            
            historyContainer.appendChild(chatItem);
        });
        
        // Add click events
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('delete-chat')) {
                    loadChat(this.dataset.chatId);
                }
            });
        });
    }
    
    // Update active chat in sidebar
    function updateActiveChatInSidebar(chatId) {
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.toggle('active', item.dataset.chatId === chatId);
        });
    }
    
    // Function to add a message to the chat UI with markdown formatting
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        // Different avatar for AI and user
        if (sender === 'ai') {
            const avatarImg = document.createElement('img');
            avatarImg.src = 'logo.png';
            avatarImg.alt = 'Pathfinder AI';
            avatarDiv.appendChild(avatarImg);
        } else {
            // For user, just use a colored background with initial or icon
            avatarDiv.textContent = 'Y'; // You can change this to user's initial
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Process content differently based on sender
        if (sender === 'ai') {
            // Process markdown for AI messages
            // Basic markdown processing for bold, italic, and code
            let formattedContent = content
                // Code blocks with language specification
                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
                // Inline code
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                // Bold text
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                // Italic text
                .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                // Bullet points
                .replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>')
                // Numbered lists
                .replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$1. $2</li>')
                // Headers
                .replace(/^#{1,6}\s+(.+)$/gm, '<h4>$1</h4>')
                // Paragraphs - ensure there are breaks between them
                .split('\n\n').map(para => `<p>${para}</p>`).join('');
                
            // Wrap lists
            formattedContent = formattedContent
                .replace(/<li>(.+?)<\/li>/g, function(match) {
                    return '<ul>' + match + '</ul>';
                })
                .replace(/<ul><\/ul><ul>/g, '')
                .replace(/<\/ul><ul>/g, '');
                
            contentDiv.innerHTML = formattedContent;
        } else {
            // For user messages, just use text
            const paragraph = document.createElement('p');
            paragraph.textContent = content;
            contentDiv.appendChild(paragraph);
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add a typing indicator to show AI is "thinking"
    function simulateTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        const avatarImg = document.createElement('img');
        avatarImg.src = 'logo.png';
        avatarImg.alt = 'Pathfinder AI';
        avatarDiv.appendChild(avatarImg);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Function to get AI response using DeepSeek API
    async function getAIResponse(userMessage) {
        // Show typing indicator
        simulateTypingIndicator();
        
        try {
            // Prepare conversation history for API
            const messages = [];
            
            // Include system message with custom instructions
            messages.push({
                role: "system",
                content: CUSTOM_AI_INSTRUCTIONS
            });
            
            // Add conversation history (up to last 10 messages for context)
            const chatHistory = chats[currentChatId].messages.slice(-10);
            chatHistory.forEach(msg => {
                messages.push({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            });
            
            // API request configuration
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek-coder",
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            };
            
            // Call DeepSeek API
            const response = await fetch(DEEPSEEK_API_URL, requestOptions);
            const data = await response.json();
            
            // Check if the API responded successfully
            if (response.ok && data.choices && data.choices[0]) {
                const aiResponse = data.choices[0].message.content;
                
                // Remove typing indicator
                removeTypingIndicator();
                
                // Add message to UI
                addMessage(aiResponse, 'ai');
                
                // Save to chat history
                saveMessage(aiResponse, 'ai');
            } else {
                throw new Error(data.error?.message || 'Failed to get response from AI');
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Show error message
            const errorMsg = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
            addMessage(errorMsg, 'ai');
            saveMessage(errorMsg, 'ai');
        }
    }
    
    // Fallback for when API is unavailable or for testing
    function getLocalAIResponse(userMessage) {
        removeTypingIndicator();
        
        const message = userMessage.toLowerCase();
        let response = "";
        
        if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
            response = "Hello! How can I help with your coding questions today?";
        } else if (message.includes("javascript") || message.includes("js")) {
            response = "JavaScript is a powerful programming language that allows you to add interactivity to websites. What specific aspect of JavaScript are you interested in learning about?";
        } else if (message.includes("python")) {
            response = "Python is known for its readability and versatility. It's great for beginners and powers everything from web apps to AI. What Python concepts are you exploring?";
        } else if (message.includes("react") || message.includes("reactjs")) {
            response = "React is a popular JavaScript library for building user interfaces. It uses a component-based approach that makes building complex UIs easier. Do you need help with React concepts or specific code examples?";
        } else if (message.includes("html") || message.includes("css")) {
            response = "HTML and CSS are the building blocks of the web. HTML provides structure while CSS handles styling. What specific part of web design are you working on?";
        } else if (message.includes("thank")) {
            response = "You're welcome! Feel free to ask if you have any other questions. Happy coding!";
        } else {
            response = "That's an interesting question. In programming, the approach would depend on specific requirements and context. Could you provide more details about what you're trying to accomplish?";
        }
        
        // Add and save the message
        addMessage(response, 'ai');
        saveMessage(response, 'ai');
    }
    
    // Send message when button is clicked
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message when Enter key is pressed
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Focus the input field when the page loads
        userInput.focus();
    }
    
    // Function to handle sending a message
    function sendMessage() {
        const text = userInput.value.trim();
        if (text !== '') {
            // Add user message to UI
            addMessage(text, 'user');
            
            // Save to chat history
            saveMessage(text, 'user');
            
            // Clear input
            userInput.value = '';
            
            // Get AI response
            getAIResponse(text);
        }
    }
    
    // Handle new chat button
    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewChat);
    }
    
    // Handle delete chat buttons (delegated event)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-chat')) {
            e.stopPropagation();
            const chatId = e.target.dataset.chatId;
            
            if (chatId && chats[chatId]) {
                // Delete the chat
                delete chats[chatId];
                saveChats(chats);
                
                // If we deleted the current chat, create a new one
                if (chatId === currentChatId) {
                    createNewChat();
                } else {
                    updateChatSidebar();
                }
            }
        }
    });
    
    // Initialize the chat sidebar on page load
    updateChatSidebar();
});

// Add typing indicator styles to the page
const style = document.createElement('style');
style.textContent = `
.typing-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 20px;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background-color: #999;
    border-radius: 50%;
    display: inline-block;
    animation: typingBounce 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typingBounce {
    0%, 80%, 100% { 
        transform: scale(0.6);
    }
    40% { 
        transform: scale(1);
    }
}
`;
document.head.appendChild(style);

// Handle mobile viewport height
function updateViewportHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

window.addEventListener('resize', updateViewportHeight);
updateViewportHeight();