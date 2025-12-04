import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { ordersAPI } from '../services/api';

const STATUS_STEPS = [
  {
    key: 'pending',
    label: 'Pedido recibido',
    description: 'Estamos procesando tu solicitud.'
  },
  {
    key: 'confirmed',
    label: 'Confirmado',
    description: 'Tu pedido fue confirmado por nuestro equipo.'
  },
  {
    key: 'preparing',
    label: 'En preparación',
    description: 'Nuestro equipo está preparando tu pastel.'
  },
  {
    key: 'ready',
    label: 'Listo para entrega',
    description: 'Tu pedido está listo para ser entregado.'
  },
  {
    key: 'delivered',
    label: 'Entregado',
    description: 'Disfruta tu pedido 🎉'
  },
  {
    key: 'cancelled',
    label: 'Cancelado',
    description: 'Esta orden fue cancelada.'
  }
];

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  preparing: 'primary',
  ready: 'success',
  delivered: 'success',
  cancelled: 'danger'
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
};

export default function Tracking() {
  const [sp] = useSearchParams();
  const { isAuthenticated, user } = useAuthAPI();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userOrderKey = user?._id ? `lastOrderId:${user._id}` : null;
  const storedOrderId = useMemo(() => {
    if (!userOrderKey) return null;
    return localStorage.getItem(userOrderKey);
  }, [userOrderKey]);
  const searchId = sp.get('id') || storedOrderId;

  useEffect(() => {
    // Elimina claves antiguas sin scope de usuario para evitar fugas entre sesiones
    localStorage.removeItem('lastOrderId');
  }, []);

  useEffect(() => {
    if (!searchId || !isAuthenticated) return;
    setLoading(true);
    setError(null);
    ordersAPI.getById(searchId)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No encontramos la orden o no tienes permiso para verla.');
        setLoading(false);
      });
  }, [searchId, isAuthenticated]);

  const statusInfo = useMemo(() => {
    if (!order?.status) return STATUS_STEPS[0];
    return STATUS_STEPS.find(step => step.key === order.status) || STATUS_STEPS[0];
  }, [order]);

  const currentStepIndex = useMemo(() => (
    STATUS_STEPS.findIndex(step => step.key === order?.status)
  ), [order?.status]);

  const timelineSteps = useMemo(() => (
    STATUS_STEPS.filter(step => step.key !== 'cancelled')
  ), []);

  if (!isAuthenticated) {
    return (
      <div className="bg-light py-5">
        <div className="container">
          <div className="card border-0 shadow-sm p-5 text-center">
            <h2 className="fw-bold mb-3">Seguimiento disponible solo para clientes</h2>
            <p className="text-muted mb-4">
              Necesitas iniciar sesión en tu cuenta real para visualizar el estado de tu pedido.
              Si aún no tienes acceso, contáctanos y te ayudaremos enseguida.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <a href="mailto:contacto@larutaelpastelazo.cl" className="btn btn-primary px-4">
                Escribir al correo
              </a>
              <a href="https://wa.me/56912345678" target="_blank" rel="noreferrer" className="btn btn-outline-secondary px-4">
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="mb-4 text-center">
          <span className="badge rounded-pill text-bg-dark text-uppercase mb-2">Seguimiento de pedido</span>
          <h1 className="display-6 fw-bold">Revisa el estado de tu entrega</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '540px' }}>
            Ingresa con tu enlace de seguimiento para conocer el estado, fecha estimada y detalles del pedido.
          </p>
        </div>

        {!searchId && (
          <div className="alert alert-info shadow-sm">
            <strong>Sin ID de seguimiento.</strong> Te enviaremos un enlace por correo al finalizar la compra.
          </div>
        )}

        {searchId && loading && (
          <div className="card border-0 shadow-sm p-4 text-center">
            <div className="spinner-border text-warning mb-3" role="status" />
            <h5 className="fw-semibold mb-1">Buscando tu orden...</h5>
            <p className="text-muted mb-0">Esto puede tomar unos segundos.</p>
          </div>
        )}

        {searchId && error && (
          <div className="alert alert-danger shadow-sm">
            <strong>Ups:</strong> {error}
          </div>
        )}

        {searchId && order && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                  <div>
                    <p className="text-uppercase text-muted mb-1">Número de orden</p>
                    <h3 className="fw-bold mb-0">{order.orderNumber || order._id}</h3>
                  </div>
                  <span className={`badge text-bg-${statusColors[order.status] || 'secondary'} px-3 py-2 fs-6`}>
                    {statusInfo.label}
                  </span>
                </div>

                <hr className="my-4" />

                <div className="row g-3">
                  <div className="col-md-4">
                    <small className="text-muted text-uppercase">Fecha de creación</small>
                    <p className="fw-semibold mb-0">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('es-CL') : 'Sin registro'}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted text-uppercase">Entrega programada</small>
                    <p className="fw-semibold mb-0">
                      {order.deliveryDate
                        ? new Date(order.deliveryDate).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
                        : 'Por confirmar'}
                      {order.deliveryTime && (
                        <span className="d-block text-muted">Horario: {order.deliveryTime}</span>
                      )}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted text-uppercase">Total</small>
                    <p className="fw-semibold mb-0">{formatCurrency(order.total)}</p>
                  </div>
                </div>

                {order.customerInfo && (
                  <div className="mt-4">
                    <h6 className="text-uppercase text-muted mb-3">Datos del destinatario</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <p className="mb-1 fw-semibold">{order.customerInfo.firstName} {order.customerInfo.lastName}</p>
                        <p className="mb-0 text-muted">{order.customerInfo.email}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1 text-muted">{order.customerInfo.phone}</p>
                        <p className="mb-0 text-muted">{order.customerInfo.address}</p>
                        {order.customerInfo.comuna && (
                          <p className="mb-0 text-muted">Comuna: {order.customerInfo.comuna}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-3">Detalle del pedido</h5>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={`${item.productId?._id || item.productId}-${index}`}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.productId?.img && (
                                <img
                                  src={item.productId.img}
                                  alt={item.productId?.name || 'Producto'}
                                  className="rounded me-3"
                                  style={{ width: 48, height: 48, objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <p className="fw-semibold mb-0">{item.productId?.name || item.name || 'Producto'}</p>
                                {item.specialNote && <small className="text-muted">{item.specialNote}</small>}
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-semibold">{item.quantity}</td>
                          <td className="text-end fw-semibold">{formatCurrency(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 mb-4">
                <h6 className="text-uppercase text-muted mb-3">Estado del pedido</h6>
                <p className="fw-semibold mb-3">{statusInfo.description}</p>
                <div className="d-flex flex-column gap-3">
                  {timelineSteps.map((step, index) => {
                    const isCompleted = currentStepIndex > index || order.status === 'delivered';
                    const isActive = currentStepIndex === index;
                    return (
                      <div key={step.key} className="d-flex align-items-start gap-3">
                        <span
                          className={`rounded-circle d-inline-flex align-items-center justify-content-center ${isCompleted || isActive ? 'bg-success text-white' : 'bg-light text-muted'}`}
                          style={{ width: 36, height: 36 }}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </span>
                        <div>
                          <p className={`fw-semibold mb-1 ${isActive ? 'text-success' : ''}`}>{step.label}</p>
                          <p className="text-muted small mb-0">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card border-0 shadow-sm p-4 bg-dark text-white">
                <h6 className="text-uppercase text-warning mb-3">¿Necesitas ayuda?</h6>
                <p className="mb-3">Nuestro equipo está disponible para resolver cualquier duda sobre tu pedido.</p>
                <div className="d-grid gap-2">
                  <a href="https://wa.me/56912345678" className="btn btn-warning btn-lg" target="_blank" rel="noreferrer">
                    Contactar por WhatsApp
                  </a>
                  <a href="mailto:contacto@larutaelpastelazo.cl" className="btn btn-outline-light btn-lg">
                    Enviar correo
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
