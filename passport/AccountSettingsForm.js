'use client';

import { useEffect, useState } from 'react';
import { avatarOptions } from '../../data/passport';
import { getPassport, signOutPassport, updatePassport } from '../../lib/passportClient';

export default function AccountSettingsForm() {
  const [passport, setPassport] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const current = getPassport();
    setPassport(current);
    setUsername(current?.username || '');
    setAvatar(current?.avatar || avatarOptions[0]);
  }, []);

  function save(event) {
    event.preventDefault();
    const next = updatePassport({ username, avatar });
    setPassport(next);
    setMessage('Passport updated on this device.');
  }

  function signOut() {
    signOutPassport();
    setPassport(null);
    setMessage('Passport signed out on this device. Your saved browser data remains unless cleared in your browser settings.');
  }

  if (!passport) {
    return (
      <div className="passport-card">
        <h2>No active Passport on this device.</h2>
        <p>Create a GR8 Passport to save games, build XP and unlock local badges.</p>
        <a className="cta" href="/passport/signup">Create Passport</a>
      </div>
    );
  }

  return (
    <form className="passport-form" onSubmit={save}>
      <label>
        Player name
        <input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={18} required />
      </label>
      <fieldset>
        <legend>Avatar</legend>
        <div className="avatar-picker">
          {avatarOptions.map((option) => (
            <button type="button" key={option} onClick={() => setAvatar(option)} className={avatar === option ? 'selected' : ''}>{option}</button>
          ))}
        </div>
      </fieldset>
      <div className="passport-actions">
        <button className="cta" type="submit">Save Passport</button>
        <button className="secondary-cta" type="button" onClick={signOut}>Sign out on this device</button>
      </div>
      {message ? <p className="form-note">{message}</p> : null}
    </form>
  );
}
