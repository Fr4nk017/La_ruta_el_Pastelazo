import RoleRoute from '../auth/RoleRoute';
import { useAuth } from '../contexts/AuthContextEnhanced';

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <RoleRoute allowedRoles={['admin']}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <i className="fas fa-user-shield me-2"></i>
                Panel de Administración
              </h2>
              <span className="badge bg-success">Admin</span>
            </div>

            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Bienvenido <strong>{user?.name}</strong>, tienes acceso completo al sistema.
            </div>

            <div className="row">
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card border-primary">
                  <div className="card-body text-center">
                    <i className="fas fa-users fa-3x text-primary mb-3"></i>
                    <h5>Gestión de Usuarios</h5>
                    <p className="text-muted">Administrar cuentas de usuario</p>
                    <button className="btn btn-primary">
                      <i className="fas fa-cog me-2"></i>
                      Gestionar
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <i className="fas fa-birthday-cake fa-3x text-success mb-3"></i>
                    <h5>Productos</h5>
                    <p className="text-muted">Gestionar catálogo de productos</p>
                    <button className="btn btn-success">
                      <i className="fas fa-plus me-2"></i>
                      Administrar
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card border-warning">
                  <div className="card-body text-center">
                    <i className="fas fa-shopping-cart fa-3x text-warning mb-3"></i>
                    <h5>Pedidos</h5>
                    <p className="text-muted">Administrar pedidos del sistema</p>
                    <button className="btn btn-warning">
                      <i className="fas fa-list me-2"></i>
                      Ver Pedidos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card border-info">
                  <div className="card-body text-center">
                    <i className="fas fa-chart-bar fa-3x text-info mb-3"></i>
                    <h5>Reportes</h5>
                    <p className="text-muted">Estadísticas y reportes</p>
                    <button className="btn btn-info">
                      <i className="fas fa-chart-line me-2"></i>
                      Ver Reportes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-users me-2"></i>
                      Usuarios del Sistema
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <i className="fas fa-user-shield text-danger me-2"></i>
                              Administrador
                            </td>
                            <td>admin@pastelazo.com</td>
                            <td><span className="badge bg-danger">Admin</span></td>
                            <td><span className="badge bg-success">Activo</span></td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="fas fa-user text-primary me-2"></i>
                              Usuario Regular
                            </td>
                            <td>usuario@pastelazo.com</td>
                            <td><span className="badge bg-primary">Usuario</span></td>
                            <td><span className="badge bg-success">Activo</span></td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <i className="fas fa-user-tie text-success me-2"></i>
                              Vendedor
                            </td>
                            <td>vendedor@pastelazo.com</td>
                            <td><span className="badge bg-success">Vendedor</span></td>
                            <td><span className="badge bg-success">Activo</span></td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleRoute>
  );
};

export default AdminPanel;