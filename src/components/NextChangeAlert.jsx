// NextChangeAlert warns the worker when the placement is about to change.
// According to the spec: if the location changes within the next 4 hours,
// show a banner like "Byter plats kl 14:00 → Golv rad 45".
// This is shown below the placement result and above the map.

import { useTranslation } from 'react-i18next'

// nextChange: { time: "14:00", placement: "Golv rad 45" } or null
function NextChangeAlert({ nextChange }) {
  const { t } = useTranslation()

  // If there's no upcoming change, show nothing at all
  if (!nextChange) return null

  return (
    <div
      style={{
        background: 'var(--color-alert-bg)',
        border: '1px solid var(--color-alert-border)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
      }}
    >
      {/* Clock icon — a simple emoji works fine here */}
      <span style={{ fontSize: '1.2rem' }} aria-hidden="true">⏰</span>

      <span>
        {/* "Byter plats kl 14:00 → Golv rad 45" */}
        <strong>{t('next_change_prefix')} {nextChange.time}</strong>
        {' → '}
        <strong>{nextChange.placement}</strong>
      </span>
    </div>
  )
}

export default NextChangeAlert
