import { useState } from 'react';

export default function AuthScreen({ onLogin, onSignup }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Your password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter your name to create an account.');
      return;
    }

    const result = mode === 'login'
      ? onLogin({ email: normalizedEmail, password })
      : onSignup({ name: name.trim(), email: normalizedEmail, password });
    if (result) setError(result);
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand"><span className="brand-mark">s</span> stride</div>
        <div className="auth-visual-copy">
          <span className="eyebrow eyebrow-light">YOUR WELLNESS, IN MOTION</span>
          <h1>Small steps.<br />Stronger you.</h1>
          <p>Make room for progress, one good day at a time.</p>
        </div>
        <div className="auth-orbit" aria-hidden="true">
          <div className="orbit-ring orbit-ring-one" />
          <div className="orbit-ring orbit-ring-two" />
          <div className="orbit-center">✦</div>
          <span className="orbit-note">show up for yourself</span>
        </div>
        <div className="auth-visual-footer">A little more movement. A lot more you.</div>
      </section>

      <section className="auth-form-side">
        <div className="auth-mobile-brand"><span className="brand-mark">s</span> stride</div>
        <div className="auth-form-wrap">
          <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'A FRESH START'}</span>
          <h2>{mode === 'login' ? 'Let’s get moving.' : 'Create your account.'}</h2>
          <p className="muted auth-intro">
            {mode === 'login' ? 'Sign in to pick up where you left off.' : 'Start building healthy habits that stick.'}
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Account options">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Sign in</button>
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); }}>Create account</button>
          </div>

          <form onSubmit={submit} className="form-stack">
            {mode === 'signup' && (
              <label className="field-label">Your name
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex Morgan" autoComplete="name" required />
              </label>
            )}
            <label className="field-label">Email address
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label className="field-label">Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="At least 6 characters" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength="6" required />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit">
              {mode === 'login' ? 'Sign in to Stride' : 'Create my account'} <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="privacy-note">Demo account only. Your sign-in and fitness records are stored in this browser, not a secure server.</p>
        </div>
      </section>
    </main>
  );
}
