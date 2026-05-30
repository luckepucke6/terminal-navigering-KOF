// AdminDashboard is a placeholder for the admin panel.
// Future iterations will add: city management, schedule editing,
// postal code ranges, and more.
// For now, it just confirms that the admin successfully logged in.

import { useTranslation } from 'react-i18next'

// onLogout: function to call when the admin clicks "Logga ut"
function AdminDashboard({ onLogout }) {
  const { t } = useTranslation()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '16px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin</h1>
        <button className="btn-ghost" onClick={onLogout}>
          {t('admin_logout')}
        </button>
      </div>

      <div
        className="card"
        style={{
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          padding: '48px 24px',
        }}
      >
        🚧 {t('admin_panel_placeholder')}
      </div>
    </div>
  )
}

export default AdminDashboard
