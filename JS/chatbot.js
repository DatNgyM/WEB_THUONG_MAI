// DOM Elements
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');

// Lưu trữ lịch sử chat
let chatHistory = [];

// Khởi tạo context mặc định cho chatbot
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    scrollToBottom();
    
    // Add system context to history
    chatHistory.push(systemContext);
    
    // Focus the input field
    userInput.focus();
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Send to API and get response
        const response = await sendMessageToServer(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add bot response to UI
        addMessageToUI('bot', response);
    } catch (error) {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Show error message
        addMessageToUI('bot', 'Sorry, I encountered an error. Please try again later.');
        console.error('Chatbot API Error:', error);
    }
});

// Helper Functions
function addMessageToUI(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    
    const icon = document.createElement('i');
    icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    avatar.appendChild(icon);
    
    const content = document.createElement('div');
    content.className = 'content';
    
    // Process message text and convert URLs to links
    const processedMessage = processMessageText(message);
    content.innerHTML = processedMessage;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

function processMessageText(text) {
    // Convert plain text to paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
    
    if (paragraphs.length === 0) {
        return `<p>${text}</p>`;
    }
    
    // Convert URLs to clickable links
    const processedParagraphs = paragraphs.map(p => {
        // URL regex pattern
        const urlPattern = /https?:\/\/[^\s]+/g;
        return p.replace(urlPattern, url => `<a href="${url}" target="_blank">${url}</a>`);
    });
    
    return processedParagraphs.map(p => `<p>${p}</p>`).join('');
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-message';
    typingDiv.innerHTML = `
        <div class="avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-message');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessageToServer(message) {
    try {
        // Thêm tin nhắn người dùng vào lịch sử để hiển thị
        const userMessage = {
            role: 'user',
            parts: [{ text: message }]
        };
        
        // Gửi tin nhắn và lịch sử trò chuyện đến server
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error');
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Unknown error');
        }
        
        // Cập nhật lịch sử trò chuyện với dữ liệu mới từ server
        chatHistory = data.history;
        
        return data.response;
    } catch (error) {
        console.error('Error communicating with chatbot API:', error);
        throw error;
    }
}

// Function to insert suggestion into input field
function insertSuggestion(suggestion) {
    userInput.value = suggestion;
    userInput.focus();
} 