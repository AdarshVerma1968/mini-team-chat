import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function Channels({ onSelect }) {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState('');

  async function load() {
    const data = await apiFetch('/channels');
    setChannels(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name) return;
    await apiFetch('/channels', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
    setName('');
    load();
  };

return (
  <div className="channels-container">
      <h3 className="channels-title">Channels</h3>

      <form onSubmit={create} className="channel-form">
        <input 
          className="channel-input"
          placeholder="New channel" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <button type="submit" className="channel-button">Create</button>
      </form>

      <ul className="channels-list">
        {channels.map((c) => (
          <li 
            key={c._id} 
            onClick={() => onSelect(c)} 
            className="channel-item"
          >
            #{c.name}
          </li>
        ))}
      </ul>
  </div>
);

}
