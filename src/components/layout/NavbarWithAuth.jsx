import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContextEnhanced'
import { useCart } from '../../contexts/CartContext'

const NavbarWithAuth = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, getCartItemsCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const UserMenu = () => (
    <div className="dropdown">
      <button 
        className="btn btn-outline-primary dropdown-toggle" 
        type="button" 
        id="userDropdown" 
        data-bs-toggle="dropdown"
      >
        <i className="fas fa-user me-2"></i>
        {user?.name}
        <span className="badge bg-secondary ms-2">{user?.role}</span>
      </button>
      <ul className="dropdown-menu" aria-labelledby="userDropdown">
        <li>
          <Link className="dropdown-item" to="/dashboard">
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" to="/profile">
            <i className="fas fa-user-edit me-2"></i>
            Mi Perfil
          </Link>
        </li>
        {user?.role === 'admin' && (
          <>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <Link className="dropdown-item" to="/admin">
                <i className="fas fa-user-shield me-2"></i>
                Panel Admin
              </Link>
            </li>
          </>
        )}
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  )

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="fas fa-birthday-cake me-2"></i>
          La Ruta el Pastelazo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalog">
                <i className="fas fa-birthday-cake me-1"></i>
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">
                <i className="fas fa-question-circle me-1"></i>
                FAQ
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {/* Carrito */}
            <Link to="/cart" className="btn btn-outline-primary me-3 position-relative">
              <i className="fas fa-shopping-cart"></i>
              {getCartItemsCount() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getCartItemsCount()}
                  <span className="visually-hidden">items en carrito</span>
                </span>
              )}
            </Link>

            {/* Autenticación */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavbarWithAuth