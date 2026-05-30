// TerminalMap loads the SVG map and highlights whichever section is active.
//
// WHY do we fetch() the SVG instead of using <img src="map.svg">?
// Because we need to reach INSIDE the SVG and change the visual style of
// individual sections (like turning section B yellow). An <img> tag treats
// the SVG as a sealed black box — we cannot touch anything inside it.
// By fetching the SVG text and injecting it into a <div>, the SVG becomes
// part of the page's DOM and we can manipulate individual elements.
//
// HOW highlighting works:
// The SVG has section groups like <g id="section-B" class="section-group">.
// To highlight section B, we add "highlighted" to its class list.
// The CSS rule .section-group.highlighted .spot { fill: yellow } does the rest.
// This keeps all the visual logic in CSS, not scattered through JavaScript.

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

// activeSection: a string like "A", "B", "Golv-left" — or null for no highlight
function TerminalMap({ activeSection }) {
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

  // When the SVG loads OR the active section changes, update the highlight.
  useEffect(() => {
    if (!containerRef.current || !mapHtml) return

    // Remove "highlighted" from ALL section groups first.
    // This clears the previous search result's highlight.
    containerRef.current.querySelectorAll('.section-group').forEach((el) => {
      el.classList.remove('highlighted')
    })

    // If a section is active, add "highlighted" to just that group.
    // The SVG's embedded CSS then turns all .spot / .floor-row within it yellow.
    if (activeSection) {
      const target = containerRef.current.querySelector(`#section-${activeSection}`)
      if (target) {
        target.classList.add('highlighted')
      }
    }
  }, [mapHtml, activeSection])

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
