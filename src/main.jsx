import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppComplete from './AppComplete.jsx'
import { initializeDefaultData } from './utils/dataInitializer.js'
import './index.css'

// Inicializar datos por defecto
initializeDefaultData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppComplete />
  </StrictMode>,
)