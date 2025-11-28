// Navbar responsive - La Ruta el Pastelazo
import { useState } from 'react';
import { Container, Button, Badge, Navbar, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuthAPI as useAuth } from '../../contexts/AuthContextAPI';
import { useCart } from '../../contexts/CartContext';

export default function SimpleNavbar() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { summary } = useCart();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleCloseMobile = () => setShowMobileMenu(false);
  const handleShowMobile = () => setShowMobileMenu(true);

  const NavItem = ({ to, icon, children, variant = '', onClick = null }) => (
    <Nav.Item className="mb-2 mb-lg-0">
      <Nav.Link 
        as={onClick ? Button : Link}
        to={!onClick ? to : undefined}
        onClick={onClick || handleCloseMobile}
        className={`px-3 py-2 rounded-pill transition-all text-decoration-none border-0 ${
          isActive(to) ? `active bg-primary text-white` : `hover-bg-light ${variant}`
        }`}
        style={{ 
          backgroundColor: variant && !isActive(to) ? (
            variant === 'warning' ? '#ffc107' : 
            variant === 'info' ? '#0dcaf0' :
            variant === 'success' ? '#198754' : 'transparent'
          ) : undefined,
          color: variant && !isActive(to) ? (
            variant === 'warning' ? '#000' :
            variant === 'info' ? '#000' :
            variant === 'success' ? '#fff' : undefined
          ) : undefined
        }}
      >
        <i className={`${icon} me-1`}></i>
        {children}
      </Nav.Link>
    </Nav.Item>
  );

  return (
    <>
      <Navbar expand="lg" className="bg-white shadow-sm border-bottom" fixed="top">
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary d-flex align-items-center">
            <span className="fs-3 me-2">🍰</span>
            <span className="text-gradient d-none d-sm-inline">La Ruta el Pastelazo</span>
            <span className="text-gradient d-sm-none">Pastelazo</span>
          </Navbar.Brand>

          {/* Carrito con contador (visible en móvil) */}
          <div className="d-lg-none d-flex align-items-center">
            <Link to="/cart" className="btn btn-outline-primary btn-sm me-2 position-relative">
              <i className="fas fa-shopping-cart"></i>
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
            
            {/* Botón hamburguesa */}
            <Button 
              variant="outline-primary" 
              onClick={handleShowMobile}
              className="border-0"
            >
              <i className="fas fa-bars"></i>
            </Button>
          </div>

          {/* Menu desktop */}
          <Navbar.Collapse className="d-none d-lg-flex">
            <Nav className="ms-auto d-flex flex-row">
              <NavItem to="/" icon="fas fa-home">Inicio</NavItem>
              <NavItem to="/catalog" icon="fas fa-birthday-cake">Catálogo</NavItem>
              <Nav.Item className="mb-2 mb-lg-0">
                <Nav.Link 
                  as={Link}
                  to="/cart"
                  className={`px-3 py-2 rounded-pill transition-all position-relative ${
                    isActive('/cart') ? 'active bg-primary text-white' : 'hover-bg-light'
                  }`}
                >
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
                </Nav.Link>
              </Nav.Item>
              <NavItem to="/checkout" icon="fas fa-credit-card">Checkout</NavItem>
              <NavItem to="/tracking" icon="fas fa-truck">Seguimiento</NavItem>
              <NavItem to="/reviews" icon="fas fa-star">Reseñas</NavItem>
              
              {/* Links administrativos */}
              {isAuthenticated && (isAdmin() || user?.role === 'trabajador') && (
                <NavItem to="/admin" icon="fas fa-tools" variant="warning">Admin Panel</NavItem>
              )}
              {isAuthenticated && isAdmin() && (
                <NavItem to="/roles-app" icon="fas fa-users-cog" variant="info">Gestión</NavItem>
              )}
              
              {/* Auth buttons */}
              {isAuthenticated ? (
                <>
                  <NavItem to="/profile" icon="fas fa-user" variant="success">Perfil</NavItem>
                  <Nav.Item>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="rounded-pill px-3 py-2" 
                      onClick={logout}
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>
                      Salir
                    </Button>
                  </Nav.Item>
                </>
              ) : (
                <Nav.Item>
                  <Link 
                    to="/profile" 
                    className="btn btn-primary rounded-pill px-4 py-2 text-white text-decoration-none"
                  >
                    <i className="fas fa-key me-1"></i>
                    Iniciar Sesión
                  </Link>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas para móvil */}
      <Offcanvas 
        show={showMobileMenu} 
        onHide={handleCloseMobile} 
        placement="end"
        className="w-75"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="d-flex align-items-center">
            <span className="fs-4 me-2">🍰</span>
            <span className="text-gradient">Menú</span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="px-0">
          <Nav className="flex-column px-3">
            {/* Usuario info si está logueado */}
            {isAuthenticated && user && (
              <div className="mb-3 p-3 bg-light rounded">
                <div className="d-flex align-items-center">
                  <i className="fas fa-user-circle fs-3 me-2 text-primary"></i>
                  <div>
                    <div className="fw-bold">{user.firstName} {user.lastName}</div>
                    <small className="text-muted">{user.role}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="mb-3">
              <h6 className="text-muted px-3 mb-2">Navegación</h6>
              <NavItem to="/" icon="fas fa-home">Inicio</NavItem>
              <NavItem to="/catalog" icon="fas fa-birthday-cake">Catálogo</NavItem>
              <NavItem to="/cart" icon="fas fa-shopping-cart">
                Carrito {summary.count > 0 && <Badge bg="danger" className="ms-1">{summary.count}</Badge>}
              </NavItem>
              <NavItem to="/checkout" icon="fas fa-credit-card">Checkout</NavItem>
              <NavItem to="/tracking" icon="fas fa-truck">Seguimiento</NavItem>
              <NavItem to="/reviews" icon="fas fa-star">Reseñas</NavItem>
            </div>

            {/* Admin Links */}
            {isAuthenticated && (isAdmin() || user?.role === 'trabajador') && (
              <div className="mb-3">
                <h6 className="text-muted px-3 mb-2">Administración</h6>
                <NavItem to="/admin" icon="fas fa-tools" variant="warning">Panel de Administración</NavItem>
                {isAdmin() && (
                  <NavItem to="/roles-app" icon="fas fa-users-cog" variant="info">Gestión de Usuarios</NavItem>
                )}
              </div>
            )}

            {/* Auth Section */}
            <div className="mt-auto">
              <hr />
              {isAuthenticated ? (
                <div className="px-3">
                  <NavItem to="/profile" icon="fas fa-user" variant="success">Mi Perfil</NavItem>
                  <Button 
                    variant="outline-danger" 
                    className="w-100 mt-2"
                    onClick={() => {
                      logout();
                      handleCloseMobile();
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="px-3">
                  <Link 
                    to="/profile" 
                    className="btn btn-primary w-100"
                    onClick={handleCloseMobile}
                  >
                    <i className="fas fa-key me-1"></i>
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Espaciado para el navbar fixed */}
      <div style={{ height: '80px' }}></div>
    </>
  );
}