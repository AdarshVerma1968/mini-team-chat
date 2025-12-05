import React, { useState } from 'react';
import { login, setAuthToken } from '../api';

export default function Login({ onAuth }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await login({ emailOrUsername, password });

    if (res.token) {
      setAuthToken(res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuth(res.user);
      window.location.reload();
    } else {
      setErr(res.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="card p-4 shadow-sm">
      <h3 className="text-center mb-3">Login</h3>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Email or username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
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

      <button className="btn btn-success w-100" type="submit">
        Login
      </button>
    </form>
  );
}
