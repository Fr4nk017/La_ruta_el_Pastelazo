// Navbar temporal sin modales - La Ruta el Pastelazo
import { Container, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function SimpleNavbar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { summary } = useCart();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm border-bottom">
      <Container>
        <nav className="navbar navbar-expand-lg navbar-light py-3">
          <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
            <span className="fs-3 me-2">🍰</span>
            <span className="text-gradient">La Ruta el Pastelazo</span>
          </Link>
          
          <ul className="navbar-nav ms-auto d-flex flex-row">
            <li className="nav-item me-3">
              <Link 
                className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/') ? 'active bg-primary text-white' : 'hover-bg-light'}`} 
                to="/" 
              >
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/catalog') ? 'active bg-primary text-white' : 'hover-bg-light'}`} to="/catalog">
                <i className="fas fa-birthday-cake me-1"></i>
                Catálogo
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className={`nav-link px-3 py-2 rounded-pill position-relative transition-all ${isActive('/cart') ? 'active bg-primary text-white' : 'hover-bg-light'}`} to="/cart">
                <i className="fas fa-shopping-cart me-1"></i>
                Carrito
                {summary.count > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem', padding: '0.25em 0.4em' }}
                  >
                    {summary.count}
                  </Badge>
                )}
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/checkout') ? 'active bg-primary text-white' : 'hover-bg-light'}`} to="/checkout">
                <i className="fas fa-credit-card me-1"></i>
                Checkout
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/tracking') ? 'active bg-primary text-white' : 'hover-bg-light'}`} to="/tracking">
                <i className="fas fa-truck me-1"></i>
                Seguimiento
              </Link>
            </li>
            <li className="nav-item me-3">
              <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/reviews') ? 'active bg-primary text-white' : 'hover-bg-light'}`} to="/reviews">
                <i className="fas fa-star me-1"></i>
                Reseñas
              </Link>
            </li>
            {isAuthenticated && (isAdmin() || user?.role === 'trabajador') && (
              <li className="nav-item me-3">
                <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/admin') ? 'active bg-warning text-dark' : 'bg-warning text-dark hover-bg-warning-dark'}`} to="/admin">
                  <i className="fas fa-tools me-1"></i>
                  Admin Panel
                </Link>
              </li>
            )}
            {isAuthenticated && isAdmin() && (
              <li className="nav-item me-3">
                <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/roles-app') ? 'active bg-info text-white' : 'bg-info text-white hover-bg-info-dark'}`} to="/roles-app">
                  <i className="fas fa-users-cog me-1"></i>
                  Gestión Usuarios
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li className="nav-item me-3">
                  <Link className={`nav-link px-3 py-2 rounded-pill transition-all ${isActive('/profile') ? 'active bg-success text-white' : 'bg-success text-white hover-bg-success-dark'}`} to="/profile">
                    <i className="fas fa-user me-1"></i>
                    Perfil
                  </Link>
                </li>
                <li className="nav-item">
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    className="rounded-pill px-3 py-2" 
                    onClick={logout}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Salir
                  </Button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary rounded-pill px-4 py-2 text-white text-decoration-none" to="/profile">
                  <i className="fas fa-key me-1"></i>
                  <strong>Iniciar Sesión</strong>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}