import React, { useState } from 'react';
import { signup, setAuthToken } from '../api';

export default function Signup({ onAuth }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await signup({ username, email, password });
    if (res.token) {
      setAuthToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuth(res.user);
      window.location.reload();
    } else {
      setErr(res.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={submit} className="card p-4 shadow-sm mb-4">
      <h3 className="text-center mb-3">Signup</h3>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {err && <div className="alert alert-danger p-2">{err}</div>}

      <button className="btn btn-primary w-100" type="submit">
        Signup
      </button>
    </form>
  );
}
