import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import NavItem from './NavItem';

/**
 * Lista de enlaces de navegación
 */
export default function NavLinks({ isActive }) {
  const { summary } = useCart();

  const routes = [
    { path: '/', label: 'Inicio' },
    { path: '/catalog', label: 'Catálogo' },
    { 
      path: '/cart', 
      label: 'Carrito',
      badge: summary.count > 0 ? {
        count: summary.count,
        variant: 'danger'
      } : null
    },
    { path: '/checkout', label: 'Checkout' },
    { path: '/tracking', label: 'Estado' },
    { path: '/reviews', label: 'Reseñas' }
  ];

  return (
    <ul className="navbar-nav ms-auto gap-2">
      {routes.map(route => (
        <NavItem 
          key={route.path} 
          to={route.path} 
          isActive={isActive(route.path)}
        >
          {route.label}
          {route.badge && (
            <Badge 
              bg={route.badge.variant} 
              pill 
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: '0.7rem' }}
            >
              {route.badge.count}
            </Badge>
          )}
        </NavItem>
      ))}
    </ul>
  );
}

NavLinks.propTypes = {
  isActive: PropTypes.func.isRequired
};