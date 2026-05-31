// PinLogin is the password gate in front of the admin panel.
// The correct password lives in the VITE_ADMIN_PASSWORD environment variable.
// VITE_ prefix means Vite injects it at build time — it ends up in the JS bundle,
// which is fine here since this is an internal warehouse app, not a public service.

import { useState } from 'react'

// VITE_ADMIN_PASSWORD is set in .env (local dev) or as a GitHub Actions secret.
// The fallback 'admin' only applies if the variable is missing entirely.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

// onSuccess: called when the correct password is entered
// onBack: called when the user clicks "Tillbaka"
function PinLogin({ onSuccess, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '48px',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
        <h2
          style={{
            margin: '0 0 24px',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: 'var(--color-text)',
          }}
        >
          Admin — logga in
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            placeholder="Lösenord"
            autoFocus
            autoComplete="current-password"
          />

          {/* Show error only after a failed attempt */}
          {error && (
            <div style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>
              Fel lösenord.
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={password.length === 0}
          >
            Logga in
          </button>
        </form>

        <button
          className="btn-ghost"
          onClick={onBack}
          style={{ marginTop: '12px', width: '100%' }}
        >
          ← Tillbaka
        </button>
      </div>
    </div>
  )
}

export default PinLogin
