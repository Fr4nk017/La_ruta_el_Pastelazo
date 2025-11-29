

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';

export default function Tracking() {
  const [sp] = useSearchParams();
  let id = sp.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback: si no hay id en la URL, buscar en localStorage
  if (!id) {
    id = localStorage.getItem('lastOrderId') || null;
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    ordersAPI.getById(id)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('No se encontró la orden o no tienes permiso para verla.');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container">
      <h1 className="h3">Seguimiento</h1>
      {!id && <p>Sin ID de seguimiento.</p>}
      {id && loading && <p>Cargando información de la orden...</p>}
      {id && error && <p style={{color:'red'}}>{error}</p>}
      {id && order && (
        <div className="card p-3 my-3">
          <h4>Orden #{order._id}</h4>
          <p><b>Estado:</b> {order.status}</p>
          <p><b>Fecha de creación:</b> {new Date(order.createdAt).toLocaleString()}</p>
          <p><b>Productos:</b></p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.productId?.name || 'Producto'} x{item.quantity}</li>
            ))}
          </ul>
          <p><b>Total:</b> ${order.total || order.amount || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}
