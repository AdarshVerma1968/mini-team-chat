const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const auth = require('../middleware/auth');

// list channels
router.get('/', auth, async (req, res) => {
  const channels = await Channel.find().sort({ createdAt: -1 });
  res.json(channels);
});

// create channel
router.post('/', auth, async (req, res) => {
  const { name, isPrivate } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });

  const exists = await Channel.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Channel name taken' });

  const channel = new Channel({ name, isPrivate: !!isPrivate, createdBy: req.user._id });
  await channel.save();
  res.json(channel);
});

router.get('/:id', async (req, res) => {
  const channel = await Channel.findById(req.params.id).populate('members', '_id username');
  if (!channel) return res.status(404).json({ message: 'Channel not found' });
  res.json(channel);
});


module.exports = router;
