import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { PRODUCTOS } from '../utils/mockProducts'

function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [alert, setAlert] = useState(null)
  
  const product = PRODUCTOS[id]

  if (!product) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Producto no encontrado</h2>
          <p className="text-muted">El producto que buscas no existe.</p>
          <Link to="/catalogo" className="btn btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    const cartItem = {
      id,
      name: product.nombre,
      price: parseInt(product.precio.replace(/[^\d]/g, '')),
      image: product.imagen
    }
    
    addItem(cartItem)
    
    setAlert({
      type: 'success',
      message: `${product.nombre} agregado al carrito`
    })
    
    setTimeout(() => setAlert(null), 3000)
  }

  return (
    <div className="container my-5">
      {/* Alerta */}
      {alert && (
        <div 
          className={`alert alert-${alert.type} alert-dismissible fade show position-fixed`}
          style={{ top: '1rem', right: '1rem', zIndex: 1050, minWidth: '250px' }}
        >
          {alert.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setAlert(null)}
          />
        </div>
      )}

      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/catalogo" className="text-decoration-none">Catálogo</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.nombre}
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.imagen} 
            alt={product.nombre}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        
        <div className="col-md-6">
          <div className="p-4">
            <h1 className="mb-3" style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
              {product.nombre}
            </h1>
            
            <p className="lead text-muted mb-4">{product.descripcion}</p>
            
            <div className="row mb-4">
              <div className="col-sm-6">
                <h5>Precio</h5>
                <p className="h4 text-primary">{product.precio}</p>
              </div>
              
              <div className="col-sm-6">
                <h5>Peso</h5>
                <p>{product.peso}</p>
              </div>
            </div>

            <div className="mb-4">
              <h5>Porciones</h5>
              <p>{product.porciones}</p>
            </div>

            <div className="mb-4">
              <h5>Ingredientes</h5>
              <ul className="list-unstyled">
                {product.ingredientes?.map((ingrediente, index) => (
                  <li key={index} className="mb-1">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    {ingrediente}
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex gap-3">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
              >
                Agregar al carrito
              </button>
              
              <Link 
                to="/catalogo" 
                className="btn btn-outline-primary btn-lg"
              >
                Seguir comprando
              </Link>
            </div>

            {(product.masVendido || product.nuevo) && (
              <div className="mt-3">
                {product.masVendido && (
                  <span className="badge bg-warning text-dark me-2">Más vendido</span>
                )}
                {product.nuevo && (
                  <span className="badge bg-success">Nuevo</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail