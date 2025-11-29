import { Navigate } from 'react-router-dom';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import ProtectedRoute from './ProtectedRoute';

const RoleRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  fallbackComponent = null,
  redirectTo = "/unauthorized" 
}) => {
  const { user, hasRole, hasPermission } = useAuthAPI();

  // Primero verificar que esté autenticado
  return (
    <ProtectedRoute>
      <RoleChecker
        user={user}
        allowedRoles={allowedRoles}
        requiredPermissions={requiredPermissions}
        fallbackComponent={fallbackComponent}
        redirectTo={redirectTo}
      >
        {children}
      </RoleChecker>
    </ProtectedRoute>
  );
};

const RoleChecker = ({ 
  children, 
  user, 
  allowedRoles, 
  requiredPermissions, 
  fallbackComponent, 
  redirectTo 
}) => {
  const { hasRole, hasPermission } = useAuthAPI();

  // Verificar roles si se especificaron
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.some(role => hasRole(role));

  // Verificar permisos si se especificaron
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => hasPermission(permission));

  // Si no tiene el rol o permisos requeridos
  if (!hasRequiredRole || !hasRequiredPermissions) {
    // Mostrar componente fallback si existe
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    // Mostrar mensaje de acceso denegado por defecto
    if (redirectTo === "/unauthorized") {
      return <UnauthorizedComponent user={user} requiredRoles={allowedRoles} />;
    }
    
    // Redirigir a la ruta especificada
    return <Navigate to={redirectTo} replace />;
  }

  // Si tiene acceso, mostrar el contenido
  return children;
};

const UnauthorizedComponent = ({ user, requiredRoles }) => (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card border-warning">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Acceso Denegado
            </h5>
          </div>
          <div className="card-body text-center">
            <p className="mb-3">
              Hola <strong>{user?.firstName} {user?.lastName}</strong>, no tienes permisos para acceder a esta sección.
            </p>
            <p className="text-muted mb-3">
              Tu rol actual: <span className="badge bg-secondary">{user?.role}</span>
            </p>
            {requiredRoles.length > 0 && (
              <p className="text-muted mb-4">
                Roles requeridos: {requiredRoles.map(role => (
                  <span key={role} className="badge bg-primary me-1">{role}</span>
                ))}
              </p>
            )}
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn btn-primary" 
                onClick={() => window.history.back()}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Volver
              </button>
              <button 
                className="btn btn-outline-primary" 
                onClick={() => window.location.href = '/'}
              >
                <i className="fas fa-home me-2"></i>
                Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RoleRoute;