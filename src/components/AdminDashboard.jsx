// AdminDashboard is the full CRUD interface for managing the "orter" table in Supabase.
// It lets admins view, add, edit and delete placement areas.
//
// IMPORTANT: For INSERT/UPDATE/DELETE to work, Supabase needs write policies
// for the anon role on the "orter" table (or RLS disabled entirely).
// Go to Supabase → Authentication → Policies → orter and add policies for
// INSERT, UPDATE, DELETE with USING/WITH CHECK: true — or click "Disable RLS".

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// The columns we display and edit — order matters for the table.
const COLUMNS = [
  { key: 'namn',             label: 'Namn',         type: 'text' },
  { key: 'postnummer_fran',  label: 'Pnr från',     type: 'number' },
  { key: 'postnummer_till',  label: 'Pnr till',     type: 'number' },
  { key: 'sektion',          label: 'Sektion',      type: 'text' },
  { key: 'plats_fran',       label: 'Plats från',   type: 'number' },
  { key: 'plats_till',       label: 'Plats till',   type: 'number' },
  { key: 'rad_fran',         label: 'Rad från',     type: 'number' },
  { key: 'rad_till',         label: 'Rad till',     type: 'number' },
  { key: 'notat',            label: 'Notat',        type: 'text' },
]

// An empty row template used when starting to add a new area.
const EMPTY_ROW = {
  namn: '', postnummer_fran: '', postnummer_till: '',
  sektion: '', plats_fran: '', plats_till: '',
  rad_fran: '', rad_till: '', notat: '',
}

// Helper: convert empty strings to null for numeric fields before saving.
// Supabase stores integers, not empty strings.
function prepareRow(row) {
  const out = {}
  for (const col of COLUMNS) {
    const val = row[col.key]
    if (col.type === 'number') {
      out[col.key] = val === '' || val === null || val === undefined ? null : Number(val)
    } else {
      out[col.key] = val === '' ? null : val
    }
  }
  return out
}

// onLogout: called when admin clicks "Logga ut" or "← Tillbaka"
function AdminDashboard({ onLogout }) {
  // All rows fetched from Supabase
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Which row is currently being edited inline (by its id)
  const [editingId, setEditingId] = useState(null)
  // A copy of the row data while editing — changes are kept here until saved
  const [editData, setEditData] = useState({})

  // Whether the "add new row" form is expanded
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState(EMPTY_ROW)
  const [saving, setSaving] = useState(false)

  // Fetch all rows from Supabase when the component loads.
  // useEffect with [] runs once on mount — like "do this when the page opens".
  useEffect(() => {
    fetchRows()
  }, [])

  async function fetchRows() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.from('orter').select('*').order('namn')
    setLoading(false)
    if (error) {
      setError('Kunde inte hämta data: ' + error.message)
      return
    }
    setRows(data)
  }

  // ---- EDIT ----

  function startEdit(row) {
    setEditingId(row.id)
    // Make a copy so changes don't affect the displayed table until saved
    setEditData({ ...row })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({})
  }

  async function saveEdit() {
    setSaving(true)
    const { error } = await supabase
      .from('orter')
      .update(prepareRow(editData))
      .eq('id', editingId)
    setSaving(false)
    if (error) {
      alert('Fel vid sparning: ' + error.message)
      return
    }
    setEditingId(null)
    setEditData({})
    fetchRows()
  }

  // ---- DELETE ----

  async function deleteRow(row) {
    if (!window.confirm(`Ta bort "${row.namn}"?`)) return
    const { error } = await supabase.from('orter').delete().eq('id', row.id)
    if (error) {
      alert('Fel vid borttagning: ' + error.message)
      return
    }
    fetchRows()
  }

  // ---- ADD ----

  async function addRow(event) {
    event.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('orter').insert(prepareRow(newRow))
    setSaving(false)
    if (error) {
      alert('Fel vid tillägg: ' + error.message)
      return
    }
    setNewRow(EMPTY_ROW)
    setShowAdd(false)
    fetchRows()
  }

  // ---- RENDER ----

  return (
    <div style={{ padding: '0 0 48px' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text)' }}>
          Admin — Områden
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-primary"
            onClick={() => { setShowAdd(!showAdd); setEditingId(null) }}
          >
            {showAdd ? 'Avbryt' : '+ Lägg till område'}
          </button>
          <button className="btn-ghost" onClick={onLogout}>
            ← Tillbaka
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: 'var(--color-error)', color: '#fff', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Add new row form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: '600' }}>Nytt område</h2>
          <form onSubmit={addRow}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginBottom: '12px' }}>
              {COLUMNS.map((col) => (
                <div key={col.key}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                    {col.label}
                  </label>
                  <input
                    type={col.type === 'number' ? 'number' : 'text'}
                    value={newRow[col.key]}
                    onChange={(e) => setNewRow({ ...newRow, [col.key]: e.target.value })}
                    placeholder={col.label}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary" disabled={saving || !newRow.namn}>
              {saving ? 'Sparar…' : 'Spara'}
            </button>
          </form>
        </div>
      )}

      {/* Data table */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '48px' }}>
          Laddar…
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                {COLUMNS.map((col) => (
                  <th key={col.key} style={{ padding: '8px 12px', fontWeight: '600', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isEditing = editingId === row.id
                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: isEditing ? 'var(--color-alert-bg)' : 'transparent',
                    }}
                  >
                    {/* Data cells — either plain text or editable inputs */}
                    {COLUMNS.map((col) => (
                      <td key={col.key} style={{ padding: '6px 12px' }}>
                        {isEditing ? (
                          <input
                            type={col.type === 'number' ? 'number' : 'text'}
                            value={editData[col.key] ?? ''}
                            onChange={(e) => setEditData({ ...editData, [col.key]: e.target.value })}
                            style={{ width: '100%', minWidth: '70px', boxSizing: 'border-box', padding: '4px 6px', fontSize: '0.875rem' }}
                          />
                        ) : (
                          <span style={{ color: row[col.key] == null ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
                            {row[col.key] ?? '–'}
                          </span>
                        )}
                      </td>
                    ))}

                    {/* Action buttons */}
                    <td style={{ padding: '6px 12px', whiteSpace: 'nowrap' }}>
                      {isEditing ? (
                        <>
                          <button
                            className="btn-primary"
                            onClick={saveEdit}
                            disabled={saving}
                            style={{ fontSize: '0.8rem', padding: '4px 10px', marginRight: '6px' }}
                          >
                            {saving ? '…' : 'Spara'}
                          </button>
                          <button
                            className="btn-ghost"
                            onClick={cancelEdit}
                            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                          >
                            Avbryt
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-ghost"
                            onClick={() => startEdit(row)}
                            style={{ fontSize: '0.8rem', padding: '4px 10px', marginRight: '6px' }}
                          >
                            Redigera
                          </button>
                          <button
                            onClick={() => deleteRow(row)}
                            style={{
                              fontSize: '0.8rem', padding: '4px 10px',
                              background: 'none', border: '1px solid var(--color-error)',
                              color: 'var(--color-error)', borderRadius: '6px', cursor: 'pointer',
                            }}
                          >
                            Ta bort
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    Inga områden hittades.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
