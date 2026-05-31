// Search is the main component for the worker view.
// It combines three things in one place:
//   1. The text input (worker types a city or postal code)
//   2. The Supabase query (looks up the "orter" table)
//   3. The result display (shows where the pallet goes)
//
// The component also tells App.jsx which section is active so the map
// can highlight it. It does this via the onSectionChange callback.

import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Helper: turn a database row into one or two human-readable placement strings.
// Returns an array so the caller can render each part on its own line.
// Examples:
//   ["Sektion B, plats 12–24"]
//   ["Golv, rad 45–60"]
//   ["Sektion C, plats 3–7", "Golv, rad 12–18"]  ← if both are set
function formatPlacement(row) {
  const parts = []

  // Rack part — only if sektion is a letter (not null, not "Golv")
  const hasRack = row.sektion && row.sektion !== 'Golv' && row.plats_fran != null
  if (hasRack) {
    const range =
      row.plats_fran === row.plats_till
        ? `${row.plats_fran}`
        : `${row.plats_fran}–${row.plats_till}`
    parts.push(`Sektion ${row.sektion}, plats ${range}`)
  }

  // Floor part — if rad_fran is set, OR if sektion is explicitly "Golv"
  const hasFloor = row.rad_fran != null || row.sektion === 'Golv'
  if (hasFloor && row.rad_fran != null) {
    const range =
      row.rad_fran === row.rad_till
        ? `${row.rad_fran}`
        : `${row.rad_fran}–${row.rad_till}`
    parts.push(`Golv, rad ${range}`)
  }

  // Fallback — should not happen if the data is correct
  if (parts.length === 0) parts.push('Okänd placering')

  return parts
}

// onResultChange: called with the full Supabase row when a match is found, or null on reset.
// App.jsx passes the row to TerminalMap so it can highlight the exact spots.
function Search({ onResultChange }) {
  // query: what the worker has typed so far
  const [query, setQuery] = useState('')

  // result: the database row if a match was found, otherwise null
  const [result, setResult] = useState(null)

  // loading: true while waiting for Supabase to respond
  const [loading, setLoading] = useState(false)

  // noResult: true if the search ran but found nothing
  const [noResult, setNoResult] = useState(false)

  async function handleSubmit(event) {
    // Stop the browser from refreshing the page on form submit
    event.preventDefault()

    const trimmed = query.trim()
    if (trimmed.length === 0) return

    // Reset everything before starting a new search
    setLoading(true)
    setNoResult(false)
    setResult(null)
    onResultChange(null) // clear map highlight

    // Decide whether the worker typed a number (postal code) or text (city)
    const isPostalCode = /^\d+$/.test(trimmed)

    let dbQuery = supabase.from('orter').select('*')

    if (isPostalCode) {
      // Postal code search: find the row whose range includes this number.
      // E.g. 852 → matches a row where postnummer_fran=800 and postnummer_till=899
      const num = parseInt(trimmed, 10)
      dbQuery = dbQuery
        .lte('postnummer_fran', num)  // postnummer_fran <= num
        .gte('postnummer_till', num)  // postnummer_till >= num
    } else {
      // City name search: ilike is case-insensitive LIKE in SQL.
      // %Sundsvall% matches "Sundsvall", "sundsvall", "SUNDSVALL" etc.
      dbQuery = dbQuery.ilike('namn', `%${trimmed}%`)
    }

    // .limit(1) — we only need the first match
    const { data, error } = await dbQuery.limit(1)

    // Log to browser console so we can debug Supabase issues
    console.log('[Search] data:', data, 'error:', error)

    setLoading(false)

    if (error || !data || data.length === 0) {
      setNoResult(true)
      return
    }

    const row = data[0]
    setResult(row)
    // Pass the full row to TerminalMap so it can highlight the exact spots
    onResultChange(row)
  }

  return (
    <div>
      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stad eller postnummer…"
          // inputMode="search" brings up the right keyboard on mobile
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Sök stad eller postnummer"
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ whiteSpace: 'nowrap' }}
          disabled={query.trim().length === 0 || loading}
        >
          {loading ? '…' : 'Sök'}
        </button>
      </form>

      {/* Nothing found */}
      {noResult && (
        <div
          className="card"
          style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}
        >
          Ingen matchning hittades.
        </div>
      )}

      {/* Result card */}
      {result && (
        <div
          className="card"
          style={{ borderLeft: '4px solid var(--color-accent)', paddingLeft: '20px' }}
        >
          {/* City name — smaller label above the big text */}
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
            }}
          >
            {result.namn}
            {result.postnummer_fran && (
              <span style={{ marginLeft: '8px' }}>
                ({result.postnummer_fran}–{result.postnummer_till})
              </span>
            )}
          </div>

          {/* Placement — the most important piece of info, must be readable at a glance.
              formatPlacement returns an array so we can show multiple lines
              (e.g. both a rack section and a floor row). */}
          {formatPlacement(result).map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--color-text)',
                lineHeight: '1.2',
                letterSpacing: '-0.5px',
                marginTop: i > 0 ? '4px' : '0',
              }}
            >
              {line}
            </div>
          ))}

          {/* Extra notes from the database, if any */}
          {result.notat && (
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
                marginTop: '8px',
                fontStyle: 'italic',
              }}
            >
              {result.notat}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
