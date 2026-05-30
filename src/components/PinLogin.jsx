// PinLogin is the admin login screen — a simple form with a PIN code field.
// Admins enter a 4-digit PIN to access the admin panel.
//
// For now, the PIN check is hardcoded here as a placeholder.
// In a real setup, this would verify the PIN against Supabase Auth.
// The hardcoded PIN is: 1234 (change before going live!)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// onSuccess: function to call when the correct PIN is entered
// onBack: function to call when the worker clicks "← Tillbaka"
function PinLogin({ onSuccess, onBack }) {
  const { t } = useTranslation()

  // pin: what the user has typed so far
  const [pin, setPin] = useState('')
  // error: a message to show if the wrong PIN was entered
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    // TODO: Replace this hardcoded check with a real Supabase Auth call.
    // The correct PIN is 1234 for now — do not ship this to production!
    if (pin === '1234') {
      setError('')
      onSuccess()
    } else {
      setError(t('pin_error'))
      setPin('')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '40px 16px',
        maxWidth: '320px',
        margin: '0 auto',
      }}
    >
      {/* Back link */}
      <button
        className="btn-ghost"
        onClick={onBack}
        style={{ alignSelf: 'flex-start', fontSize: '0.875rem' }}
      >
        {t('back_to_search')}
      </button>

      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: 'var(--color-text)',
          textAlign: 'center',
        }}
      >
        {t('admin_title')}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        <input
          type="password"
          value={pin}
          onChange={(e) => {
            // Only allow digits, max 6 characters
            const digits = e.target.value.replace(/\D/g, '').slice(0, 6)
            setPin(digits)
            setError('')
          }}
          placeholder={t('pin_placeholder')}
          // inputMode="numeric" shows the number keypad on mobile phones
          inputMode="numeric"
          autoComplete="current-password"
          style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }}
        />

        {/* Error message — only shown after a wrong attempt */}
        {error && (
          <div
            style={{
              color: 'var(--color-error)',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={pin.length < 4}
        >
          {t('pin_submit')}
        </button>
      </form>
    </div>
  )
}

export default PinLogin
