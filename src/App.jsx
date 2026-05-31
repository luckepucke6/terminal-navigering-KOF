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

// ---- Routing helper ----
// We use the URL hash (#admin) so the admin page survives a page refresh
// and works on GitHub Pages without any server configuration.
function getInitialView() {
  return window.location.hash === '#admin' ? 'admin' : 'worker'
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
  // 'admin': the admin area (password-protected)
  const [view, setView] = useState(getInitialView)
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)

  // Listen for browser back/forward navigation changing the hash.
  // Without this, pressing the back button would change the URL but not the view.
  useEffect(() => {
    function onHashChange() {
      if (window.location.hash === '#admin') {
        setView('admin')
      } else {
        setView('worker')
        setAdminAuthenticated(false)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function goToAdmin() {
    window.location.hash = 'admin'
    setView('admin')
  }

  function goToWorker() {
    window.location.hash = ''
    setView('worker')
    setAdminAuthenticated(false)
  }

  // ---- SEARCH STATE ----
  // activeResult: the full Supabase row from the last search, or null.
  // Search.jsx manages its own display state — App.jsx just passes this
  // down to TerminalMap so it knows which spots to highlight.
  const [activeResult, setActiveResult] = useState(null)

  // ---- RENDER ----
  return (
    <div id="app">
      <div className={view === 'admin' ? 'admin-wrapper' : 'app-wrapper'}>

        {/* Header: app title + theme toggle, always visible */}
        <header className="app-header">
          <span className="app-title">{t('app_title')}</span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        {/* ---- WORKER VIEW ---- */}
        {view === 'worker' && (
          <>
            {/* Search handles input, Supabase query, and result display */}
            <Search onResultChange={setActiveResult} />

            {/* The map is always visible, even before a search */}
            <TerminalMap activeResult={activeResult} />

            {/* No admin link here — admins navigate directly to /#admin */}
            <footer className="app-footer" style={{ minHeight: '24px' }} />
          </>
        )}

        {/* ---- ADMIN VIEW ---- */}
        {view === 'admin' && (
          <>
            {/* If not yet authenticated, show the password login screen */}
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
