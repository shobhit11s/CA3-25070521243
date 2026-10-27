const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', getOrCreateConversation);
router.get('/conversation/:id', getMessages);
router.post('/', sendMessage);

module.exports = router;
