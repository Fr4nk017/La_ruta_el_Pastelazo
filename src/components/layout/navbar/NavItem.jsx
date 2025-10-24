import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Ítem individual del menú de navegación
 */
export default function NavItem({ to, isActive, children }) {
  return (
    <li className="nav-item">
      <Link 
        className={`nav-link ${isActive ? 'active' : ''}`} 
        to={to} 
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    </li>
  );
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};