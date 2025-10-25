import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import { initializeDefaultData } from './utils/dataInitializer.js'
import './utils/debugHelpers.js' // Cargar funciones de debug
import './index.css'

// Inicializar datos por defecto
initializeDefaultData();

// En desarrollo, mostrar información útil
if (import.meta.env.DEV) {
  console.log('🍰 La Ruta el Pastelazo - Modo Desarrollo');
  console.log('🛠️ Funciones de debug disponibles:');
  console.log('   • window.resetLocalStorage() - Resetear datos');
  console.log('   • window.checkLocalStorageStatus() - Ver estado actual');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)