'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { avatarOptions } from '../../data/passport';
import { createPassport, getPassport } from '../../lib/passportClient';

export default function PassportSignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    const existing = getPassport();
    if (existing) {
      setMessage('A GR8 Passport already exists on this device. Opening My Arcade now.');
      setTimeout(() => router.push('/my-arcade'), 700);
      return;
    }
    createPassport({ username, avatar });
    setMessage('GR8 Passport created. Opening My Arcade.');
    setTimeout(() => router.push('/my-arcade'), 700);
  }

  return (
    <form className="passport-form" onSubmit={submit}>
      <label>
        Player name
        <input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={18} placeholder="Example: NeonRay" required />
      </label>
      <fieldset>
        <legend>Choose an avatar</legend>
        <div className="avatar-picker">
          {avatarOptions.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setAvatar(option)}
              className={avatar === option ? 'selected' : ''}
              aria-label={`Choose avatar ${option}`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>
      <button className="cta" type="submit">Create my GR8 Passport</button>
      {message ? <p className="form-note">{message}</p> : null}
      <p className="form-note muted-note">Foundation mode: your Passport is stored on this device now. The database-ready structure is included for the next in-house backend phase.</p>
    </form>
  );
}
