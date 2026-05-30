// SearchBar is the text input at the top of the worker view.
// The worker types a city name or postal code and presses Sök.
// This component doesn't know anything about Supabase yet —
// it just captures what the user typed and tells its parent via onSearch().

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// onSearch is a function passed in from App.jsx.
// When the worker submits the form, we call onSearch(query) and let
// App.jsx handle the actual database lookup.
function SearchBar({ onSearch }) {
  const { t } = useTranslation()

  // query holds whatever the user has typed so far.
  // useState('') means it starts as an empty string.
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    // Prevent the browser from reloading the page on form submit —
    // that's the default browser behavior for forms, but we don't want it.
    event.preventDefault()

    const trimmed = query.trim()
    if (trimmed.length === 0) return

    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search_placeholder')}
        // inputMode="search" shows the right keyboard on mobile phones
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label={t('search_placeholder')}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ whiteSpace: 'nowrap' }}
        disabled={query.trim().length === 0}
      >
        {t('search_button')}
      </button>
    </form>
  )
}

export default SearchBar
