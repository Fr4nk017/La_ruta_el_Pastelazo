// Navbar principal - Pastelería 1000 Sabores
import { useState } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import LoginModal from '../ui/LoginModal';
import RegisterModal from '../ui/RegisterModal';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { summary } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <>
      <header className="py-3 border-bottom">
        <Container className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <img 
              src="/imagenes/Logo la ruta el pastelazo.png" 
              alt="Logotipo Pastelería 1000 Sabores" 
              width="72" 
              height="72" 
              loading="lazy"
              style={{ borderRadius: '8px' }}
            />
            <div>
              <h1 className="h3 m-0 font-pacifico" style={{ color: '#8B4513' }}>
                Pastelería 1000 Sabores
              </h1>
              <p className="text-muted m-0">Celebrando 50 años de dulzura y tradición</p>
            </div>
          </div>
          
          <nav aria-label="Navegación principal">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                  to="/" 
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/catalog') ? 'active' : ''}`} to="/catalog">
                  Catálogo
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link position-relative ${isActive('/cart') ? 'active' : ''}`} to="/cart">
                  Carrito
                  {summary.count > 0 && (
                    <Badge 
                      bg="danger" 
                      pill 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {summary.count}
                    </Badge>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/checkout') ? 'active' : ''}`} to="/checkout">
                  Checkout
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/tracking') ? 'active' : ''}`} to="/tracking">
                  Estado
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/reviews') ? 'active' : ''}`} to="/reviews">
                  Reseñas
                </Link>
              </li>
              {isAuthenticated && isAdmin() && (
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/roles-app') ? 'active' : ''}`} to="/roles-app">
                    <i className="fas fa-users-cog me-1"></i>
                    Gestión
                  </Link>
                </li>
              )}
              {isAuthenticated ? (
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/profile') ? 'active' : ''}`} to="/profile">
                    Perfil
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Button 
                    variant="link" 
                    className="nav-link border-0 p-2" 
                    onClick={() => setShowLogin(true)}
                    style={{ 
                      color: '#6c757d', 
                      textDecoration: 'none',
                      background: 'none'
                    }}
                  >
                    Ingresar
                  </Button>
                </li>
              )}
              {isAuthenticated && (
                <li className="nav-item">
                  <Button 
                    variant="link" 
                    className="nav-link border-0 p-2" 
                    onClick={logout}
                    style={{ 
                      color: '#dc3545', 
                      textDecoration: 'none',
                      background: 'none'
                    }}
                  >
                    Salir
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </Container>
      </header>

      <LoginModal 
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onSwitchToRegister={switchToRegister}
      />
      
      <RegisterModal 
        show={showRegister}
        onHide={() => setShowRegister(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}