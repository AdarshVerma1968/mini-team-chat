const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function signup({ username, email, password }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

export async function login({ emailOrUsername, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrUsername, password })
  });
  return res.json();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}


export function getAuthToken() {
  return localStorage.getItem('token');
}

export function setAuthToken(token) {
  localStorage.setItem('token', token);
}

export function apiFetch(endpoint, opts = {}) {
  const token = getAuthToken();
  return fetch(`${API_URL}${endpoint}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {})
    }
  }).then((r) => r.json());
}
