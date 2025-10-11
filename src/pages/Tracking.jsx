function Tracking() {
  const orders = [
    {
      id: '2024-001',
      date: '2024-10-10',
      status: 'En preparación',
      items: ['Torta de Chocolate', 'Mousse de Chocolate'],
      total: 46000
    },
    {
      id: '2024-002',
      date: '2024-10-08',
      status: 'Entregado',
      items: ['Torta de Vainilla'],
      total: 25000
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'En preparación': return 'warning'
      case 'En camino': return 'info'
      case 'Entregado': return 'success'
      default: return 'secondary'
    }
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
        Estado de tus pedidos
      </h2>

      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">No tienes pedidos activos.</p>
          <a href="/catalogo" className="btn btn-primary">Hacer un pedido</a>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>Pedido #{order.id}</strong>
                  <span className={`badge bg-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-2">Fecha: {order.date}</p>
                  <p className="mb-2">
                    <strong>Productos:</strong><br />
                    {order.items.join(', ')}
                  </p>
                  <p className="mb-0">
                    <strong>Total: ${order.total.toLocaleString('es-CL')}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tracking