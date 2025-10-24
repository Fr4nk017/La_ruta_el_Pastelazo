import PropTypes from 'prop-types';

/**
 * Componente del logo y título de la pastelería
 */
export default function Logo({ className = '' }) {
  return (
    <div className={`d-flex flex-column flex-md-row align-items-center gap-3 ${className}`}>
      <img 
        src="/imagenes/Logo la ruta el pastelazo.png" 
        alt="Logotipo Pastelería 1000 Sabores" 
        width="72" 
        height="72" 
        loading="lazy"
        className="img-fluid rounded-3"
        style={{ maxWidth: '72px' }}
      />
      <div className="text-center text-md-start">
        <h1 className="h3 m-0 font-pacifico gradient-text">
          Pastelería 1000 Sabores
        </h1>
        <p className="text-muted m-0 d-none d-sm-block">
          Celebrando 50 años de dulzura y tradición
        </p>
      </div>
    </div>
  );
}

Logo.propTypes = {
  className: PropTypes.string
};