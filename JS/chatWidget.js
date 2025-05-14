// Global variables
let chatHistory = [];
let chatWidgetActive = false;

// System prompt for Gemini
const systemContext = {
    role: 'model',
    parts: [{
        text: `You are the AI shopping assistant for Five:07, a premium tech store. 
        You help customers with product information, shopping advice, and general tech questions. 
        Be friendly, helpful, and knowledgeable about technology products like smartphones, laptops, 
        wearables, and other electronics. If asked about specific Five:07 policies like shipping, 
        returns, or warranty, explain that Five:07 offers free shipping on orders over $50, 
        a 30-day return policy, and 1-year warranty on all products. Keep responses concise 
        but informative, with a friendly, conversational tone.`
    }]
};
// Create chat widget DOM elements when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createChatWidget();
    setupEventListeners();
    
    // Initialize chat history
    chatHistory.push(systemContext);
});

// Create the chat widget HTML elements and append to the document
function createChatWidget() {
    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.className = 'chat-button';
    chatButton.setAttribute('aria-label', 'Open chat assistant');
    chatButton.id = 'chat-button';
    chatButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
    
    // Create chat widget
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.id = 'chat-widget';
    
    // Create chat header
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.innerHTML = `
        <h3>Five:07 Assistant</h3>
        <button class="chat-close" id="chat-close" aria-label="Close chat">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Create chat messages container
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    chatMessages.id = 'chat-messages';
    
    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">
            Hello! I'm the Five:07 shopping assistant. How can I help you today?
        </div>
    `;
    chatMessages.appendChild(welcomeMessage);
    
    // Create chat input container
    const chatInputContainer = document.createElement('div');
    chatInputContainer.className = 'chat-input-container';
    chatInputContainer.innerHTML = `
        <input type="text" class="chat-input" id="chat-input" placeholder="Type your message...">
        <button class="chat-send" id="chat-send" aria-label="Send message">
            <i class="fas fa-paper-plane"></i>
        </button>
    `;
    
    // Assemble the widget
    chatWidget.appendChild(chatHeader);
    chatWidget.appendChild(chatMessages);
    chatWidget.appendChild(chatInputContainer);
    
    // Add to document
    document.body.appendChild(chatButton);
    document.body.appendChild(chatWidget);
}

// Set up event listeners for the chat widget
function setupEventListeners() {
    // Toggle chat widget when clicking the chat button
    document.getElementById('chat-button').addEventListener('click', toggleChatWidget);
    
    // Close chat widget when clicking the close button
    document.getElementById('chat-close').addEventListener('click', toggleChatWidget);
    
    // Send message when clicking the send button
    document.getElementById('chat-send').addEventListener('click', sendMessage);
    
    // Send message when pressing Enter in the input field
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Toggle the chat widget visibility
function toggleChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    chatWidgetActive = !chatWidgetActive;
    
    if (chatWidgetActive) {
        chatWidget.classList.add('active');
        document.getElementById('chat-input').focus();
    } else {
        chatWidget.classList.remove('active');
    }
}

// Send a message to the chatbot
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to server
    sendMessageToServer(message)
        .then(response => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add bot response to UI
            addMessageToUI('bot', response);
        })
        .catch(error => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Show error message
            addMessageToUI('bot', 'Sorry, I encountered an error. Please try again later.');
            console.error('Error:', error);
        });
}

// Add a message to the chat UI
function addMessageToUI(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator in the chat
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-typing';
    typingIndicator.id = 'chat-typing';
    typingIndicator.innerHTML = `
        <div class="typing-bubble"></div>
        <div class="typing-bubble"></div>
        <div class="typing-bubble"></div>
    `;
    
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator from the chat
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('chat-typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to the server API
async function sendMessageToServer(message) {
    try {
        const response = await fetch('/api/chatbot/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Unknown error');
        }
        
        // Update chat history with new data
        chatHistory = data.history;
        
        return data.response;
    } catch (error) {
        console.error('Error sending message to server:', error);
        throw error;
    }
} 