import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

function Cart() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2 className="mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
            Tu carrito está vacío
          </h2>
          <p className="text-muted mb-4">
            Agrega algunos de nuestros deliciosos productos para comenzar.
          </p>
          <Link to="/catalogo" className="btn btn-primary">
            Explorar catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
        Tu carrito de compras
      </h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Productos ({items.length})</h5>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
            
            <div className="card-body p-0">
              {items.map((item) => (
                <div key={item.id} className="border-bottom p-3">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '80px', objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <h6 className="mb-1">{item.name}</h6>
                      <small className="text-muted">
                        {formatPrice(item.price)} c/u
                      </small>
                    </div>
                    
                    <div className="col-md-3">
                      <div className="input-group input-group-sm">
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control text-center" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-md-2">
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                    
                    <div className="col-md-1">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item.id)}
                        title="Eliminar producto"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Resumen del pedido</h5>
            </div>
            
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span className="text-muted">A calcular</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>{formatPrice(getTotal())}</strong>
              </div>
              
              <Link 
                to="/checkout" 
                className="btn btn-primary w-100 mb-2"
              >
                Proceder al checkout
              </Link>
              
              <Link 
                to="/catalogo" 
                className="btn btn-outline-primary w-100"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart