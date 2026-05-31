// TerminalMap loads the SVG map and highlights specific pallet spots or floor rows.
//
// WHY do we fetch() the SVG instead of using <img src="map.svg">?
// Because we need to reach INSIDE the SVG and change the visual style of
// individual spots. An <img> tag treats the SVG as a sealed black box —
// we cannot touch anything inside it. By fetching the SVG text and injecting
// it into a <div>, the SVG becomes part of the page's DOM and we can
// manipulate individual elements.
//
// HOW highlighting works:
// Each spot is a <rect class="spot"> followed by a <text class="spot-num">NUMBER</text>.
// We find the text elements whose number falls within [plats_fran, plats_till],
// then add "highlighted" to the preceding rect.
// The SVG's embedded CSS rule .spot.highlighted { fill: yellow } does the rest.

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

// activeResult: the full Supabase row object, or null for no highlight.
// Expected fields: sektion, plats_fran, plats_till, rad_fran, rad_till
function TerminalMap({ activeResult }) {
  const { t } = useTranslation()

  const [mapHtml, setMapHtml] = useState('')
  const [error, setError] = useState(false)

  // containerRef lets us reach inside the injected SVG with querySelector().
  const containerRef = useRef(null)

  // Fetch the SVG once when the component first loads.
  // Empty dependency array [] means: run this effect only once, on mount.
  useEffect(() => {
    // import.meta.env.BASE_URL is set by Vite from the "base" option in vite.config.js.
    // Locally it is "/" so we get "/map.svg".
    // On GitHub Pages it is "/terminal-navigering-KOF/" so we get
    // "/terminal-navigering-KOF/map.svg" — which is where the file actually lives.
    fetch(`${import.meta.env.BASE_URL}map.svg`)
      .then((response) => {
        if (!response.ok) throw new Error('SVG not found')
        return response.text()
      })
      .then((svgText) => setMapHtml(svgText))
      .catch(() => setError(true))
  }, [])

  // When the SVG loads OR the search result changes, update the highlight.
  useEffect(() => {
    if (!containerRef.current || !mapHtml) return

    // Clear all previously highlighted section groups and individual spots.
    containerRef.current
      .querySelectorAll('.section-group.highlighted, .spot.highlighted, .floor-row.highlighted, .floor-row-recv.highlighted')
      .forEach((el) => el.classList.remove('highlighted'))

    if (!activeResult) return

    const { sektion, plats_fran, plats_till } = activeResult

    if (sektion === 'Golv') {
      // Floor placement: add "highlighted" to both floor section groups.
      // The CSS rule .section-group.highlighted .floor-row turns them yellow.
      // The floor is split into two SVG groups — we highlight both so the
      // whole floor area lights up as a visual cue.
      const left = containerRef.current.querySelector('#section-Golv-left')
      const right = containerRef.current.querySelector('#section-Golv-right')
      if (left) left.classList.add('highlighted')
      if (right) right.classList.add('highlighted')
    } else {
      // Rack placement (sections A–F): highlight each spot whose number is in [plats_fran, plats_till].
      // Each spot is a rect.spot immediately followed by a text.spot-num with the spot number.
      // So textEl.previousElementSibling gives us the rect to highlight.
      const sectionEl = containerRef.current.querySelector(`#section-${sektion}`)
      if (!sectionEl) return
      sectionEl.querySelectorAll('text.spot-num').forEach((textEl) => {
        const spotNum = parseInt(textEl.textContent, 10)
        if (spotNum >= plats_fran && spotNum <= plats_till) {
          const rect = textEl.previousElementSibling
          if (rect?.classList.contains('spot')) {
            rect.classList.add('highlighted')
          }
        }
      })
    }
  }, [mapHtml, activeResult])

  if (error) {
    return (
      <div className="card" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Kunde inte ladda terminalkarta.
      </div>
    )
  }

  return (
    <div className="card">
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
          fontWeight: '600',
        }}
      >
        {t('map_title')}
      </div>

      {/* dangerouslySetInnerHTML injects the fetched SVG directly into this div.
          The name sounds alarming but is safe here — we control the source
          file. It's the only way to get interactive SVG inline. */}
      <div
        className="map-container"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: mapHtml }}
      />
    </div>
  )
}

export default TerminalMap
