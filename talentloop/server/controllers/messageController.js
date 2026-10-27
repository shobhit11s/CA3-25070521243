const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get all conversations for logged in user
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email avatar role title')
      .populate('project', 'title status')
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start or find conversation with another user
// @route   POST /api/messages/conversations
// @access  Private
exports.getOrCreateConversation = async (req, res, next) => {
  try {
    const { recipientId, projectId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID is required.',
      });
    }

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot start conversation with yourself.',
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      ...(projectId ? { project: projectId } : {}),
    })
      .populate('participants', 'name email avatar role title')
      .populate('project', 'title status');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        project: projectId || null,
        lastMessage: 'Conversation started',
        lastMessageAt: new Date(),
      });

      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar role title')
        .populate('project', 'title status');
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversation/:id
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    // Check participant
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        receiver: req.user._id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID and message content are required.',
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const receiverId = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim(),
    });

    conversation.lastMessage = content.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    next(error);
  }
};
