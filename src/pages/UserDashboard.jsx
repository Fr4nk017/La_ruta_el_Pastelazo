import RoleRoute from '../auth/RoleRoute';
import { useAuthAPI as useAuth } from '../contexts/AuthContextAPI';

const UserDashboard = () => {
  const { user } = useAuthAPI();

  return (
    <RoleRoute allowedRoles={['user', 'vendor', 'admin']}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <i className="fas fa-tachometer-alt me-2"></i>
                Mi Dashboard
              </h2>
              <div>
                <span className="badge bg-primary me-2">{user?.role}</span>
                <span className="text-muted">Bienvenido, {user?.name}</span>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card border-primary">
                  <div className="card-body text-center">
                    <i className="fas fa-shopping-bag fa-3x text-primary mb-3"></i>
                    <h5>Mis Pedidos</h5>
                    <p className="text-muted">Ver historial de pedidos</p>
                    <h3 className="text-primary">12</h3>
                    <button className="btn btn-primary">
                      <i className="fas fa-eye me-2"></i>
                      Ver Pedidos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <i className="fas fa-heart fa-3x text-success mb-3"></i>
                    <h5>Favoritos</h5>
                    <p className="text-muted">Productos guardados</p>
                    <h3 className="text-success">5</h3>
                    <button className="btn btn-success">
                      <i className="fas fa-list me-2"></i>
                      Ver Favoritos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 mb-4">
                <div className="card border-warning">
                  <div className="card-body text-center">
                    <i className="fas fa-user fa-3x text-warning mb-3"></i>
                    <h5>Mi Perfil</h5>
                    <p className="text-muted">Actualizar información</p>
                    <span className="badge bg-success">Verificado</span>
                    <br />
                    <button className="btn btn-warning mt-2">
                      <i className="fas fa-edit me-2"></i>
                      Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido específico por rol */}
            <RoleRoute allowedRoles={['vendor', 'admin']}>
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-store me-2"></i>
                        Panel de Vendedor
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3 text-center">
                          <i className="fas fa-birthday-cake fa-2x text-info mb-2"></i>
                          <h6>Productos</h6>
                          <h4 className="text-info">25</h4>
                        </div>
                        <div className="col-md-3 text-center">
                          <i className="fas fa-chart-line fa-2x text-success mb-2"></i>
                          <h6>Ventas</h6>
                          <h4 className="text-success">$850.000</h4>
                        </div>
                        <div className="col-md-3 text-center">
                          <i className="fas fa-users fa-2x text-warning mb-2"></i>
                          <h6>Clientes</h6>
                          <h4 className="text-warning">45</h4>
                        </div>
                        <div className="col-md-3 text-center">
                          <i className="fas fa-star fa-2x text-primary mb-2"></i>
                          <h6>Rating</h6>
                          <h4 className="text-primary">4.8</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RoleRoute>

            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-clock me-2"></i>
                      Actividad Reciente
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      <div className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">
                            <i className="fas fa-shopping-cart text-success me-2"></i>
                            Pedido realizado
                          </h6>
                          <small>Hace 3 horas</small>
                        </div>
                        <p className="mb-1">Torta de chocolate - $15.000</p>
                      </div>
                      <div className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">
                            <i className="fas fa-heart text-danger me-2"></i>
                            Producto agregado a favoritos
                          </h6>
                          <small>Hace 1 día</small>
                        </div>
                        <p className="mb-1">Cupcakes de vainilla</p>
                      </div>
                      <div className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">
                            <i className="fas fa-user text-primary me-2"></i>
                            Perfil actualizado
                          </h6>
                          <small>Hace 3 días</small>
                        </div>
                        <p className="mb-1">Información de contacto actualizada</p>
                      </div>
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

export default UserDashboard;