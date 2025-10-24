import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../../contexts/AuthContext';
import NavItem from './NavItem';

/**
 * Componente de autenticación en la barra de navegación
 */
export default function AuthSection({ onShowLogin }) {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <>
        <NavItem to="/profile" isActive={false}>
          Perfil
        </NavItem>
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
      </>
    );
  }

  return (
    <li className="nav-item">
      <Button 
        variant="link" 
        className="nav-link border-0 p-2" 
        onClick={onShowLogin}
        style={{ 
          color: '#6c757d', 
          textDecoration: 'none',
          background: 'none'
        }}
      >
        Ingresar
      </Button>
    </li>
  );
}

AuthSection.propTypes = {
  onShowLogin: PropTypes.func.isRequired
};