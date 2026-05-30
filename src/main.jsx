// main.jsx is the entry point — the very first file that runs.
// It does three things:
// 1. Loads translations (i18n must be set up BEFORE we render any component)
// 2. Loads global styles
// 3. Mounts the React app into the #root div in index.html

import React from 'react'
import ReactDOM from 'react-dom/client'

// Import i18n FIRST, before App — so translations are ready when components render.
import './i18n.js'

import './styles/global.css'
import App from './App.jsx'

// ReactDOM.createRoot() connects React to the <div id="root"> in index.html.
// .render() tells React what to put inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode is a development helper — it finds potential problems
  // in your code and shows extra warnings in the browser console.
  // It doesn't affect the production build.
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
