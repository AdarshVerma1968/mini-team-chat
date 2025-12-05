import { io } from 'socket.io-client';
import { getAuthToken } from './api';

let socket;

export function initSocket() {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
    autoConnect: false
  });

  // auto-auth after connect
  socket.on('connect', () => {
    const token = getAuthToken();
    if (token) {
      socket.emit('auth', { token });
    }
  });

  return socket;
}

export function getSocket() {
  return socket;
}
