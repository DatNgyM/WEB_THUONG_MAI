const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Gemini API credentials
const GEMINI_API_KEY = 'AIzaSyDK1evDRSFNCRucBRYS4QbZj530tXMK7xM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Middleware để log yêu cầu
router.use((req, res, next) => {
    console.log(`Chatbot API request: ${req.method} ${req.originalUrl}`);
    next();
});

// Endpoint để xử lý tin nhắn chatbot
router.post('/send', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }
        
        // Tạo chuỗi tin nhắn cho cuộc trò chuyện
        const chatHistory = history || [];
        
        // Thêm tin nhắn mới từ người dùng
        chatHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });
        
        // Chuẩn bị request tới Gemini API
        const payload = {
            contents: chatHistory
        };
        
        // Gọi API Gemini
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            return res.status(response.status).json({
                success: false,
                error: 'Failed to get response from AI service',
                details: errorText
            });
        }
        
        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            return res.status(500).json({
                success: false,
                error: 'No response candidates returned from AI service'
            });
        }
        
        // Lấy phản hồi từ Gemini
        const aiResponse = data.candidates[0].content;
        
        // Thêm vào lịch sử trò chuyện
        chatHistory.push({
            role: 'model',
            parts: [{ text: aiResponse.parts[0].text }]
        });
        
        // Trả về cho client
        return res.json({
            success: true,
            response: aiResponse.parts[0].text,
            history: chatHistory
        });
        
    } catch (error) {
        console.error('Server error in chatbot route:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

module.exports = router; 