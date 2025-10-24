import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import RoleRoute from './auth/RoleRoute'
import { AuthProvider } from './contexts/AuthContextEnhanced'
import { CartProvider } from './contexts/CartContext'

// Layout
import Footer from './components/layout/Footer'
import NavbarWithAuth from './components/layout/NavbarWithAuth'

// Páginas existentes
import Catalog from './pages/Catalog'
import FAQ from './pages/FAQ'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Nuevas páginas de autenticación
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'

// Componentes existentes que ahora serán páginas protegidas
import Cart from './components/Cart'
import ContactForm from './components/ContactForm'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Páginas wrapper para componentes existentes
const CartPage = () => (
  <div className="container mt-4">
    <h2 className="mb-4">Mi Carrito</h2>
    <Cart />
  </div>
)

const ContactPage = () => (
  <div className="container mt-4">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4 text-center">Contáctanos</h2>
        <ContactForm />
      </div>
    </div>
  </div>
)

const ProfilePage = () => (
  <div className="container mt-4">
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">
              <i className="fas fa-user me-2"></i>
              Mi Perfil
            </h4>
          </div>
          <div className="card-body">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  </div>
)

function AppComplete() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-vh-100 d-flex flex-column">
            <NavbarWithAuth />
            
            <main className="flex-grow-1">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactPage />} />
                
                {/* Rutas protegidas (requieren login) */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
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
                
                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default AppComplete