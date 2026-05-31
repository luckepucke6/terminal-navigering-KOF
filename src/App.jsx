// App.jsx is the root component — the "boss" of the whole app.
// It decides which view to show (worker search OR admin panel) and
// manages the state that the whole app needs to know about.
//
// State is like the app's memory. When state changes, React re-renders
// the parts of the screen that depend on that state.

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Search from './components/Search'
import TerminalMap from './components/TerminalMap'
import ThemeToggle from './components/ThemeToggle'
import PinLogin from './components/PinLogin'
import AdminDashboard from './components/AdminDashboard'

// ---- Theme helpers ----
// Read the user's preference from localStorage, or fall back to the OS setting.
function getInitialTheme() {
  const saved = localStorage.getItem('kof-theme')
  if (saved === 'dark' || saved === 'light') return saved
  // window.matchMedia checks the operating system's dark/light mode preference.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const { t } = useTranslation()

  // ---- THEME STATE ----
  // 'light' or 'dark'. Controls the data-theme attribute on <html>.
  const [theme, setTheme] = useState(getInitialTheme)

  // Whenever theme changes, update the <html> element and save to localStorage.
  // useEffect runs AFTER React has painted the screen.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('kof-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  // ---- VIEW STATE ----
  // 'worker': the main search screen (open to everyone)
  // 'admin': the admin area (PIN-protected)
  const [view, setView] = useState('worker')
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)

  function goToAdmin() {
    setView('admin')
  }

  function goToWorker() {
    setView('worker')
    setAdminAuthenticated(false)
  }

  // ---- SEARCH STATE ----
  // activeSection: which section to highlight on the map (e.g. "B", "Golv").
  // Search.jsx manages its own result state — App.jsx only needs to know
  // which section is active so it can pass it down to TerminalMap.
  const [activeSection, setActiveSection] = useState(null)

  // ---- RENDER ----
  return (
    <div id="app">
      <div className="app-wrapper">

        {/* Header: app title + theme toggle, always visible */}
        <header className="app-header">
          <span className="app-title">{t('app_title')}</span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* ---- WORKER VIEW ---- */}
        {view === 'worker' && (
          <>
            {/* Search handles input, Supabase query, and result display */}
            <Search onSectionChange={setActiveSection} />

            {/* The map is always visible, even before a search */}
            <TerminalMap activeSection={activeSection} />

            {/* Small admin link at the bottom */}
            <footer className="app-footer">
              <button
                className="btn-ghost"
                onClick={goToAdmin}
                style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}
              >
                Admin
              </button>
            </footer>
          </>
        )}

        {/* ---- ADMIN VIEW ---- */}
        {view === 'admin' && (
          <>
            {/* If not yet authenticated, show the PIN login screen */}
            {!adminAuthenticated && (
              <PinLogin
                onSuccess={() => setAdminAuthenticated(true)}
                onBack={goToWorker}
              />
            )}

            {/* If authenticated, show the admin dashboard */}
            {adminAuthenticated && (
              <AdminDashboard onLogout={goToWorker} />
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default App
