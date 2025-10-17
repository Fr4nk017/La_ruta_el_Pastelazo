// Componente Button personalizado - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import { Button as BootstrapButton } from 'react-bootstrap';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon = null,
  loading = false,
  className = '',
  ...props 
}) {
  return (
    <BootstrapButton
      variant={variant}
      size={size}
      disabled={loading}
      className={`${className} ${loading ? 'pe-none' : ''}`}
      {...props}
    >
      {loading ? (
        <>
          <span 
            className="spinner-border spinner-border-sm me-2" 
            role="status" 
            aria-hidden="true"
          ></span>
          Cargando...
        </>
      ) : (
        <>
          {icon && <span className="me-2">{icon}</span>}
          {children}
        </>
      )}
    </BootstrapButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  className: PropTypes.string
};