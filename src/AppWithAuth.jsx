import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import RoleRoute from './auth/RoleRoute';
import { AuthProvider } from './contexts/AuthContextEnhanced';

// Páginas
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart';
import Catalog from './pages/Catalog';
import Home from './pages/Home';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';

// Layout
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';

const AppWithAuth = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <Navbar />
          
          <main className="flex-grow-1">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/catalog" element={<Catalog />} />
              
              {/* Rutas protegidas (requieren login) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas por rol - Solo Admin */}
              <Route 
                path="/admin" 
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </RoleRoute>
                } 
              />
              
              {/* Rutas por permisos - Gestión de productos */}
              <Route 
                path="/manage-products" 
                element={
                  <RoleRoute 
                    allowedRoles={['admin', 'vendor']}
                    requiredPermissions={['manage_products']}
                  >
                    <div className="container mt-4">
                      <h2>Gestión de Productos</h2>
                      <p>Solo para Admin y Vendedores con permisos de gestión.</p>
                    </div>
                  </RoleRoute>
                } 
              />
              
              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

const NotFound = () => (
  <div className="container mt-5 text-center">
    <h1 className="display-1">404</h1>
    <h2>Página no encontrada</h2>
    <p>La página que buscas no existe.</p>
    <button onClick={() => window.history.back()} className="btn btn-primary">
      Volver
    </button>
  </div>
);

export default AppWithAuth;