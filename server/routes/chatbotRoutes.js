// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      File: server/routes/chatbotRoutes.js
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
const express = require("express");
const router = express.Router();

// Use require for the controller
const { askChatbot } = require("../controllers/chatbotController");

// Define the route for asking the chatbot a question
// POST /api/chatbot/ask
router.post('/ask', askChatbot);

// Use module.exports for consistency
module.exports = router;