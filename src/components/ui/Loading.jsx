// Componente Loading - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';

export default function Loading({ 
  size = 'md', 
  text = 'Cargando...', 
  variant = 'primary',
  fullPage = false 
}) {
  const spinnerSize = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  };

  const content = (
    <div className="text-center">
      <Spinner 
        animation="border" 
        variant={variant}
        style={spinnerSize[size]}
        className="mb-2"
      />
      {text && <div className="text-muted">{text}</div>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        {content}
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      {content}
    </div>
  );
}

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  variant: PropTypes.string,
  fullPage: PropTypes.bool
};