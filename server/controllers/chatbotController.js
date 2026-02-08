const axios = require('axios');
require('dotenv').config();

const askChatbot = async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }

    if (!apiKey) {
        console.error('GROQ_API_KEY is not set in the .env file.');
        return res.status(500).json({ 
            message: 'AI service is not configured. Please add GROQ_API_KEY to your .env file.' 
        });
    }

    try {
        console.log('Sending request to Groq API...');
        console.log('Message:', message);

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.1-8b-instant', 
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful and friendly shopping assistant for an e-commerce website. Provide concise, helpful responses about products, shipping, returns, and customer service. Be warm and professional.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 200,
                top_p: 0.9
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('✅ Response received from Groq');

        const aiResponse = response.data.choices[0].message.content.trim();
        
        console.log('AI Response:', aiResponse);

        return res.status(200).json({ reply: aiResponse });

    } catch (error) {
        console.error('=== GROQ API ERROR ===');
        console.error('Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
        console.error('Error Message:', error.message);

        const errorData = error.response?.data;
        const statusCode = error.response?.status;

        // Handle specific error cases
        if (statusCode === 401 || statusCode === 403) {
            return res.status(401).json({ 
                message: 'Invalid API key. Please check your GROQ_API_KEY in .env file.' 
            });
        }

        if (statusCode === 429) {
            return res.status(429).json({ 
                message: 'Rate limit exceeded. Please wait a moment and try again.' 
            });
        }

        if (statusCode === 500 || statusCode === 503) {
            return res.status(503).json({ 
                message: 'AI service is temporarily unavailable. Please try again in a moment.' 
            });
        }

        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return res.status(504).json({ 
                message: 'Request timeout. Please try again.' 
            });
        }

        return res.status(500).json({ 
            message: 'Error communicating with AI service.',
            error: errorData?.error?.message || error.message
        });
    }
};

module.exports = { askChatbot };