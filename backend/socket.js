// Socket helper: config socket events and simple presence tracking in-memory
const Message = require('./models/Message');
const Channel = require('./models/Channel');

module.exports = function setupSocket(io) {
  // Map userId -> Set(socketIds)
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    // authenticate event: client must emit { token } after connect
    socket.on('auth', async (payload) => {
      try {
        const jwt = require('jsonwebtoken');
        const token = payload.token;
        const payloadData = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payloadData.id;

        // track socket
        const set = userSockets.get(socket.userId) || new Set();
        set.add(socket.id);
        userSockets.set(socket.userId, set);

        // notify others (simple presence) — broadcast global presence
        io.emit('presence', { userId: socket.userId, online: true });

        socket.emit('authenticated', { ok: true, userId: socket.userId });
      } catch (err) {
        socket.emit('unauthorized');
      }
    });

    socket.on('join_channel', async ({ channelId }) => {
  if (!socket.userId) return socket.emit('error', 'Not authenticated');
  
  socket.join(channelId);

  const channel = await Channel.findById(channelId);
  
  // Add user to members array in DB if not already present
  if (!channel.members.some((id) => id.toString() === socket.userId.toString())) {
    channel.members.push(socket.userId);
    await channel.save();
  }

  // Send last messages
  const messages = await Message.find({ channelId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('senderId', 'username');
  socket.emit('channel_history', messages.reverse());

  // Emit updated member count to everyone in the channel
  io.to(channelId).emit('member_count', channel.members.length);
});

socket.on('leave_channel', async ({ channelId }) => {
  if (!socket.userId) return socket.emit('error', 'Not authenticated');
  socket.leave(channelId);

  const channel = await Channel.findById(channelId);
  channel.members = channel.members.filter(
    (id) => id.toString() !== socket.userId.toString()
  );
  await channel.save();

  io.to(channelId).emit('member_count', channel.members.length);
});


    socket.on('send_message', async ({ channelId, content }) => {
      if (!socket.userId) return socket.emit('error', 'Not authenticated');
      if (!content || !channelId) return;
      const msg = await Message.create({
        channelId,
        senderId: socket.userId,
        content
      });
      await msg.populate('senderId', 'username');

      // emit to channel
      io.to(channelId).emit('new_message', msg);
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        const set = userSockets.get(socket.userId);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) {
            userSockets.delete(socket.userId);
            io.emit('presence', { userId: socket.userId, online: false });
          } else {
            userSockets.set(socket.userId, set);
          }
        }
      }
      console.log('Socket disconnected', socket.id);
    });
  });
};
