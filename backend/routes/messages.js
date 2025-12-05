const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// get messages with cursor pagination
// ?limit=50&before=<timestamp-or-id>
router.get('/:channelId', auth, async (req, res) => {
  const { channelId } = req.params;
  const limit = Math.min(100, parseInt(req.query.limit) || 50);
  const before = req.query.before; // optional ISO date or message id

  const query = { channelId };
  if (before) {
    // try date parse
    const d = Date.parse(before);
    if (!isNaN(d)) {
      query.createdAt = { $lt: new Date(d) };
    } else {
      // try ObjectId fallback if user passes id string (not implemented here)
      // We'll fallback to createdAt only in this starter.
      query.createdAt = { $lt: new Date(before) };
    }
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'username');

  res.json(messages.reverse()); // return ascending
});

router.post('/:channelId', auth, async (req, res) => {
  const { channelId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });

  const message = await Message.create({
    channelId,
    senderId: req.user._id,
    content
  });

  // populate and return
  await message.populate('senderId', 'username');
  res.json(message);
});

module.exports = router;
