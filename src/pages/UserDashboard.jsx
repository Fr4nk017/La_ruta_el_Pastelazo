import RoleRoute from '../auth/RoleRoute';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';

const UserDashboard = () => {
  const { user } = useAuthAPI();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    ordersAPI.getUserOrders()
      .then((data) => {
        // Soporta distintas estructuras de respuesta
        let ordersArr = [];
        if (Array.isArray(data)) {
          ordersArr = data;
        } else if (data && Array.isArray(data.orders)) {
          ordersArr = data.orders;
        } else if (data && data.data && Array.isArray(data.data.orders)) {
          ordersArr = data.data.orders;
        }
        setOrders(ordersArr);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se pudieron cargar tus pedidos.');
        setLoading(false);
      });
  }, []);

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
                <span className="text-muted">Bienvenido, {user?.firstName || user?.name}</span>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-4">
                <div className="card border-primary">
                  <div className="card-body">
                    <h5 className="mb-3">Mis Pedidos</h5>
                    {loading && <p>Cargando pedidos...</p>}
                    {error && <p style={{color:'red'}}>{error}</p>}
                    {!loading && !error && orders.length === 0 && <p>No tienes pedidos aún.</p>}
                    {!loading && !error && orders.length > 0 && (
                      <ul className="list-group">
                        {orders.map((order) => (
                          <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                              <b>#{order._id.slice(-6)}</b> - {order.status} - {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <a href={`/tracking?id=${order._id}`} className="btn btn-sm btn-outline-primary">Ver seguimiento</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Aquí puedes agregar más tarjetas o secciones como favoritos, perfil, etc. */}
          </div>
        </div>
      </div>
    </RoleRoute>
  );
};

export default UserDashboard;