import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary para capturar errores en componentes hijos
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger">
                <h2 className="h4 mb-3">😕 Algo salió mal</h2>
                <p className="mb-3">
                  Lo sentimos, ha ocurrido un error inesperado.
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="text-start">
                    <summary className="mb-2 cursor-pointer">Detalles del error</summary>
                    <pre className="small text-danger">
                      {this.state.error?.toString()}
                    </pre>
                  </details>
                )}
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => window.location.reload()}
                >
                  Recargar página
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
