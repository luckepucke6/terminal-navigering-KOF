// ThemeToggle is a small button in the header that switches between
// light mode (sun) and dark mode (moon). The actual switching logic
// lives in App.jsx — this component just shows the button and calls
// onToggle() when pressed.

import { useTranslation } from 'react-i18next'

// theme: 'light' or 'dark'
// onToggle: function to call when the button is clicked
function ThemeToggle({ theme, onToggle }) {
  const { t } = useTranslation()

  const isDark = theme === 'dark'

  return (
    <button
      className="btn-ghost"
      onClick={onToggle}
      aria-label={isDark ? t('toggle_light') : t('toggle_dark')}
      style={{ padding: '6px 12px', fontSize: '1.2rem' }}
    >
      {/* Show sun when in dark mode (click to go light), moon when in light mode */}
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle
