// PlacementResult shows the answer to the worker's search.
// It takes a result object from App.jsx and displays it clearly.
// "Clearly" matters — workers are often in a hurry, in a cold warehouse,
// wearing gloves. The placement must be impossible to miss.

import { useTranslation } from 'react-i18next'

// result: { city, placement, section } or null (nothing searched yet)
// noResult: true if a search was done but nothing was found
function PlacementResult({ result, noResult }) {
  const { t } = useTranslation()

  // If a search was run but returned nothing
  if (noResult) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
        {t('no_result')}
      </div>
    )
  }

  // If no search has been run yet, show nothing
  if (!result) return null

  return (
    <div
      className="card"
      style={{
        borderLeft: '4px solid var(--color-accent)',
        paddingLeft: '20px',
      }}
    >
      {/* City name, smaller text above */}
      <div
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          marginBottom: '4px',
        }}
      >
        {result.city}
      </div>

      {/* Placement — this is the most important piece of info.
          Make it BIG so workers can read it at a glance. */}
      <div
        style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: 'var(--color-text)',
          lineHeight: '1.1',
          letterSpacing: '-0.5px',
        }}
      >
        {result.placement}
      </div>

      {/* Label underneath */}
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          marginTop: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {t('placement_label')}
      </div>
    </div>
  )
}

export default PlacementResult
