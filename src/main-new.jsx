import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppComplete from './AppComplete.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppComplete />
  </StrictMode>,
)