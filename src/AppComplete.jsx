import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import RoleRoute from './auth/RoleRoute'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

// Layout
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'

// Páginas existentes
import Catalog from './pages/Catalog'
import FAQ from './pages/FAQ'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Reviews from './pages/Reviews'
import Checkout from './pages/Checkout'

// Nuevas páginas de autenticación
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import RolesApp from './pages/RolesApp'
import UserDashboard from './pages/UserDashboard'

// Componentes existentes que ahora serán páginas protegidas
import ContactForm from './components/ContactForm'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Página wrapper para contacto
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

function AppComplete() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            
            <main className="flex-grow-1">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/login" element={<Login />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/reviews" element={<Reviews />} />
                
                {/* Rutas protegidas (requieren login) */}
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
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
                
                <Route 
                  path="/roles-app" 
                  element={
                    <RoleRoute allowedRoles={['admin']}>
                      <RolesApp />
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