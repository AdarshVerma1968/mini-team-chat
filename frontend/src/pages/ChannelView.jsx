import React, { useEffect, useRef, useState } from 'react';
import { apiFetch, getAuthToken } from '../api';
import { initSocket, getSocket } from '../socket';

export default function ChannelView({ channel, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState(0);
  const listRef = useRef(null);

  // Initialize socket and listen for events
useEffect(() => {
  if (!channel) return;

  const socket = initSocket();
  socket.connect();

  const token = getAuthToken();
  if (token) socket.emit('auth', { token });

  // Fetch channel info from backend
  apiFetch(`/channels/${channel._id}`).then((ch) => {
    setMembers(ch.members?.length || 0);

    // If the user is already a member, auto-join the socket room
    if (ch.members?.some((m) => m._id === user._id)) {
      socket.emit('join_channel', { channelId: channel._id });
      setJoined(true);
    }
  });

  // Listen for messages
  socket.on('channel_history', (msgs) => setMessages(msgs));
  socket.on('new_message', (msg) => setMessages((s) => [...s, msg]));

  // Listen for member count updates
  socket.on('member_count', (count) => setMembers(count));

  return () => {
    if (joined) socket.emit('leave_channel', { channelId: channel._id });
    socket.off('channel_history');
    socket.off('new_message');
    socket.off('member_count');
  };
}, [channel._id]);


  // Load older messages
  const loadOlder = async () => {
    if (!messages.length || pageLoading) return;
    setPageLoading(true);
    const earliest = messages[0].createdAt;
    const res = await apiFetch(
      `/messages/${channel._id}?limit=25&before=${encodeURIComponent(earliest)}`
    );
    if (!res || res.length === 0) setHasMore(false);
    else setMessages((prev) => [...res, ...prev]);
    setPageLoading(false);
  };

  // Send new message
  const send = () => {
    if (!text.trim()) return;
    const socket = getSocket();
    socket.emit('send_message', { channelId: channel._id, content: text });
    setText('');
  };

  // Handle Join / Leave
  const handleJoinLeave = () => {
    const socket = getSocket();
    if (joined) {
      socket.emit('leave_channel', { channelId: channel._id });
      setJoined(false);
      setMessages([]);
    } else {
      socket.emit('join_channel', { channelId: channel._id });
      setJoined(true);
    }
  };

  return (
    <div className="channel-view">
      <div className="channel-header" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // pushes content to left and right
  }}>
        <span>#{channel.name}</span>
        <span style={{ marginLeft: '10px', fontSize: '0.9rem', color: '#555' }}>
          Members: {members}
        </span>
        <button
          style={{ marginLeft: 'auto' }}
          onClick={handleJoinLeave}
          className={joined ? 'leave-btn' : 'join-btn'}
        >
          {joined ? 'Leave' : 'Join'}
        </button>
      </div>

      <div className="messages" ref={listRef}>
        {hasMore && (
          <button className="load-more" onClick={loadOlder} disabled={pageLoading}>
            {pageLoading ? 'Loading...' : 'Load older messages'}
          </button>
        )}
        {messages.map((m) => (
          <div key={m._id} className="message">
            <div className="msg-user">{m.senderId?.username || 'Unknown'}</div>
            <div className="msg-content">{m.content}</div>
            <div className="msg-time">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      {joined && (
        <div className="composer">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
          />
          <button onClick={send}>Send</button>
        </div>
      )}
      {!joined && <p style={{ padding: '10px' }}>Join the channel to send messages.</p>}
    </div>
  );
}
