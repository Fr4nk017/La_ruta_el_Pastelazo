import { memo, useState, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import LoginModal from '../ui/LoginModal';
import RegisterModal from '../ui/RegisterModal';
import { Logo, NavLinks, AuthSection } from './navbar/index.js';

/**
 * Navbar principal de la aplicación con gestión optimizada de modales
 * @component
 */
const Navbar = memo(() => {
  const location = useLocation();
  // Possible values: 'none', 'login', 'register'
  const [activeModal, setActiveModal] = useState('none');

  // Verifica si una ruta está activa (memoizado)
  const isActive = useMemo(() => {
    return (path) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(path);
    };
  }, [location.pathname]);

  // Manejadores unificados para modales
  const modalHandlers = useMemo(() => ({
    showLogin: () => setActiveModal('login'),
    showRegister: () => setActiveModal('register'),
    closeModal: () => setActiveModal('none'),
    switchToRegister: () => setActiveModal('register'),
    switchToLogin: () => setActiveModal('login')
  }), []);

  // JSX memoizado para modales
  const renderModals = useMemo(() => (
    <>
      <LoginModal 
        show={activeModal === 'login'}
        onHide={modalHandlers.closeModal}
        onSwitchToRegister={modalHandlers.switchToRegister}
      />
      
      <RegisterModal 
        show={activeModal === 'register'}
        onHide={modalHandlers.closeModal}
        onSwitchToLogin={modalHandlers.switchToLogin}
      />
    </>
  ), [activeModal, modalHandlers]);

  return (
    <>
      <header className="py-3 border-bottom sticky-top bg-white">
        <Container fluid="xxl" className="px-3">
          <div className="navbar navbar-expand-lg">
            <Logo />
            
            <button
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <nav className="collapse navbar-collapse" id="navbarNav">
              <NavLinks isActive={isActive} />
              <AuthSection onShowLogin={modalHandlers.showLogin} />
            </nav>
          </div>
        </Container>
      </header>

      {renderModals}
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;