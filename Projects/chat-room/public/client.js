// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const usernameInput = document.getElementById('usernameInput');
const setUsernameBtn = document.getElementById('setUsernameBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const typingIndicator = document.getElementById('typingIndicator');
const currentUsernameDisplay = document.getElementById('currentUsername');
const usersList = document.getElementById('usersList');
const userCount = document.getElementById('userCount');
const typingUser = document.querySelector('.typing-user');

// Client Variables
let socket = null;
let username = localStorage.getItem('chatUsername') || '';
let isTyping = false;
let typingTimeout = null;

// Server Configuration
const SERVER_URL = `ws://${window.location.hostname}:8080`;

/**
 * Initialize WebSocket connection
 */
function initializeWebSocket() {
    try {
        socket = new WebSocket(SERVER_URL);

        // Connection opened
        socket.addEventListener('open', (event) => {
            console.log('✅ Connected to server');
            updateConnectionStatus(true);
            
            // Send username if available
            if (username) {
                socket.send(JSON.stringify({
                    type: 'setUsername',
                    username: username
                }));
            }
        });

        // Message received
        socket.addEventListener('message', (event) => {
            handleMessage(JSON.parse(event.data));
        });

        // Connection closed
        socket.addEventListener('close', (event) => {
            console.log('❌ Disconnected from server');
            updateConnectionStatus(false);
            messageInput.disabled = true;
            sendBtn.disabled = true;
            
            // Attempt to reconnect after 3 seconds
            setTimeout(() => {
                console.log('🔄 Attempting to reconnect...');
                initializeWebSocket();
            }, 3000);
        });

        // Error handling
        socket.addEventListener('error', (event) => {
            console.error('⚠️ WebSocket error:', event);
            updateConnectionStatus(false);
        });

    } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        updateConnectionStatus(false);
    }
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(isConnected) {
    if (isConnected) {
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
        statusText.textContent = 'Connected';
        messageInput.disabled = false;
        sendBtn.disabled = !messageInput.value.trim();
    } else {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.textContent = 'Disconnected';
        messageInput.disabled = true;
        sendBtn.disabled = true;
    }
}

/**
 * Handle incoming messages from server
 */
function handleMessage(data) {
    switch (data.type) {
        case 'message':
            displayMessage(data);
            break;
        case 'userJoined':
            displaySystemMessage(`${data.username} joined the chat`);
            updateUsersList(data.users);
            break;
        case 'userLeft':
            displaySystemMessage(`${data.username} left the chat`);
            updateUsersList(data.users);
            break;
        case 'typing':
            showTypingIndicator(data.username);
            break;
        case 'stopTyping':
            hideTypingIndicator();
            break;
        case 'usersList':
            updateUsersList(data.users);
            break;
    }
}

/**
 * Display a chat message
 */
function displayMessage(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${data.isOwn ? 'sent' : 'received'}`;

    const timestamp = new Date(data.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = data.message;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'message-info';
    
    if (!data.isOwn) {
        const usernameSpan = document.createElement('span');
        usernameSpan.className = 'message-username';
        usernameSpan.textContent = data.username;
        infoDiv.appendChild(usernameSpan);
    }

    const timeSpan = document.createElement('span');
    timeSpan.textContent = timestamp;
    infoDiv.appendChild(timeSpan);

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(infoDiv);

    // Remove welcome message if it exists
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // Hide typing indicator
    hideTypingIndicator();
}

/**
 * Display system message
 */
function displaySystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'text-align: center; color: #999; padding: 10px; font-style: italic; font-size: 0.9em;';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * Show typing indicator
 */
function showTypingIndicator(username) {
    typingUser.textContent = username;
    typingIndicator.classList.remove('hidden');
}

/**
 * Hide typing indicator
 */
function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
}

/**
 * Update users list
 */
function updateUsersList(users) {
    userCount.textContent = users.length;
    usersList.innerHTML = '';

    if (users.length === 0) {
        usersList.innerHTML = '<li class="no-users">No users online</li>';
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
}

/**
 * Send a message
 */
function sendMessage() {
    const message = messageInput.value.trim();

    if (!message || !socket || socket.readyState !== WebSocket.OPEN) {
        return;
    }

    // Send message
    socket.send(JSON.stringify({
        type: 'message',
        message: message
    }));

    // Clear input
    messageInput.value = '';
    messageInput.focus();
    sendBtn.disabled = true;

    // Notify typing stopped
    if (isTyping) {
        socket.send(JSON.stringify({
            type: 'stopTyping'
        }));
        isTyping = false;
    }
}

/**
 * Handle typing indicator
 */
function handleTyping() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    clearTimeout(typingTimeout);

    if (!isTyping) {
        isTyping = true;
        socket.send(JSON.stringify({
            type: 'typing'
        }));
    }

    // Send stopTyping after 1 second of inactivity
    typingTimeout = setTimeout(() => {
        if (isTyping) {
            socket.send(JSON.stringify({
                type: 'stopTyping'
            }));
            isTyping = false;
        }
    }, 1000);
}

/**
 * Auto-scroll to bottom of messages
 */
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Set username
 */
function setUsername() {
    const newUsername = usernameInput.value.trim();

    if (!newUsername) {
        alert('Please enter a username');
        return;
    }

    if (newUsername.length > 20) {
        alert('Username must be 20 characters or less');
        return;
    }

    username = newUsername;
    localStorage.setItem('chatUsername', username);
    currentUsernameDisplay.textContent = `👤 ${username}`;
    currentUsernameDisplay.classList.remove('hidden');
    usernameInput.value = '';

    // Send username to server
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'setUsername',
            username: username
        }));
    }

    messageInput.focus();
}

/**
 * Event Listeners
 */

// Send button
sendBtn.addEventListener('click', sendMessage);

// Message input - Enter key to send
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

// Message input - Typing indicator
messageInput.addEventListener('input', (event) => {
    handleTyping();
    
    // Enable/disable send button
    if (event.target.value.trim()) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
});

// Username button
setUsernameBtn.addEventListener('click', setUsername);

// Username input - Enter key
usernameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        setUsername();
    }
});

// Restore username on page load
window.addEventListener('load', () => {
    if (username) {
        currentUsernameDisplay.textContent = `👤 ${username}`;
        currentUsernameDisplay.classList.remove('hidden');
    }
    
    // Initialize WebSocket
    initializeWebSocket();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.close();
    }
});
