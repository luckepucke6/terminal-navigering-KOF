# CLAUDE.md

## Project overview
A terminal navigation app for a cold storage facility.
Workers search for a city or postal code and instantly see
where to place the pallet — including a visual map of the terminal.

## Core user flows
1. Worker searches for city or postal code
2. App shows current placement based on time and day
3. App shows a map with the correct section highlighted
4. If placement changes soon, app shows: "Changes location at 14:00"
5. Admin (PIN-protected) can edit cities, postal codes and schedules

## Terminal layout (Kylen)
- Racking (ställaget): sections A, B (long rows, top),
  C, D (sides), E, F (bottom middle) — each with numbered pallet spots
- Floor (golvet): rows 1–74, receiving area at rows 65–74
- Freezer (frysen): separate zone, to be added later

## Assets
- Terminal map is stored as an SVG file in /src/assets/map.svg
- SVG sections must be named to match terminal sections:
  A, B, C, D, E, F, Golv
- Do not hardcode the map inline — always load from file

## Data model
Each city has:
- Name
- Postal code range (e.g. 400–519)
- Zone: kyl or frys
- Schedule: array of { days, from, till, placement }
  e.g. { days: ["mon","tue","wed","thu","fri"], from: "06:00",
  till: "14:00", placement: "B-12" }

## Tech stack
- React (Vite)
- Supabase (database + auth)
- SVG map of terminal (interactive, highlights active section)
- PWA (works on mobile, no install required)
- No unnecessary dependencies — keep it lean

## Auth
- Workers: no login required, search page is always open
- Admins: PIN-code login via Supabase
- 2–3 admin accounts max

## UI rules
- Mobile first — this is primarily used on the floor, on phones
- Admin interface is designed for desktop — larger forms,
  table views, easy editing of schedules and placements
- Both dark mode and light mode (respect system preference,
  toggle available)
- Language: Swedish now, English later
  (use i18n-friendly structure from the start)
- Show current placement clearly at the top
- Always show next schedule change if within 4 hours:
  "Byter plats kl 14:00 → Golv rad 45"
- Map always visible below the text result
- Keep it fast and simple — workers are in a hurry

## Code rules
- Structured and readable — components in separate files
- No clever one-liners, clarity over brevity
- All domain knowledge lives in Supabase, not hardcoded
- Add ELI5 comments throughout the code explaining what
  each part does and why — the developer is learning React
  and wants to understand the code as they read it
- Example of a good ELI5 comment:
  // We use useEffect here because we want to fetch data
  // from Supabase when the component first loads.
  // Think of it as "do this once when the page opens".
- SVG map sections are named to match terminal sections
  (A, B, C, D, E, F, Golv)