import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useProfile } from '../contexts/ProfileContext'

function Checkout() {
  const { items, getTotal, clearCart } = useCart()
  const { user } = useProfile()
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'credit'
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simular procesamiento del pedido
    setTimeout(() => {
      alert('¡Pedido realizado con éxito! Te contactaremos pronto.')
      clearCart()
      setIsProcessing(false)
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (items.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>No hay productos en el carrito</h2>
          <p className="text-muted">Agrega productos antes de proceder al checkout.</p>
          <a href="/catalogo" className="btn btn-primary">Ir al catálogo</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
        Finalizar pedido
      </h2>

      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="card shadow-sm mb-4">
              <div className="card-header">
                <h5 className="mb-0">Información de contacto</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Nombre completo *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Teléfono *</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-header">
                <h5 className="mb-0">Información de entrega</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Dirección *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">Ciudad *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">Notas adicionales</label>
                  <textarea 
                    className="form-control" 
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Instrucciones especiales, referencia de ubicación, etc."
                  />
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-header">
                <h5 className="mb-0">Método de pago</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    id="credit"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="credit">
                    Tarjeta de crédito/débito
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    id="transfer"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="transfer">
                    Transferencia bancaria
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    id="cash"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="cash">
                    Efectivo contra entrega
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100"
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Resumen del pedido</h5>
            </div>
            <div className="card-body">
              {items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>{formatPrice(getTotal())}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout