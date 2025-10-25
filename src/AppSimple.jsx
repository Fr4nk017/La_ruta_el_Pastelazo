// Versión simplificada para debug - AppComplete
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import RolesApp from './pages/RolesApp';
import Home from './pages/Home';

function AppCompleteSimple() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ padding: '20px' }}>
            <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <a href="/" style={{ marginRight: '20px' }}>Inicio</a>
              <a href="/roles-app">Gestión de Roles</a>
            </nav>
            
            <Routes>
              <Route path="/" element={
                <div>
                  <h1>Bienvenido a La Ruta el Pastelazo</h1>
                  <p>Versión simplificada para debug</p>
                  <div>
                    <h3>Credenciales de prueba:</h3>
                    <p><strong>Admin:</strong> admin@larutaelpastelazo.cl / admin123</p>
                    <p><strong>Trabajador:</strong> trabajador@larutaelpastelazo.cl / worker123</p>
                    <p><strong>Cliente:</strong> cliente@larutaelpastelazo.cl / client123</p>
                  </div>
                </div>
              } />
              
              <Route path="/roles-app" element={<RolesApp />} />
              
              <Route path="*" element={
                <div>
                  <h2>Página no encontrada</h2>
                  <a href="/">Volver al inicio</a>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default AppCompleteSimple;