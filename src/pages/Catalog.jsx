import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { PRODUCTOS, CATEGORIAS } from '../utils/mockProducts'

function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [alert, setAlert] = useState(null)
  const { addItem } = useCart()

  const products = useMemo(() => {
    return Object.entries(PRODUCTOS).map(([id, product]) => ({ id, ...product }))
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [products, selectedCategory, searchTerm])

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
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
    <div className="container my-4">
      {/* Alerta de feedback */}
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

      <h2 className="mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
        Explora nuestras categorías
      </h2>

      {/* Filtros */}
      <form className="row g-3 mb-4">
        <div className="col-md-4">
          <select 
            className="form-select" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="">Todas las categorías</option>
            {Object.entries(CATEGORIAS).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="col-md-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => {
              setSelectedCategory('')
              setSearchTerm('')
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </form>

      {/* Resultados */}
      <div className="row g-4" id="catalogo-lista">
        {filteredProducts.length === 0 ? (
          <div className="col">
            <div className="alert alert-warning text-center">
              <h4>No se encontraron productos</h4>
              <p>Intenta con otros términos de búsqueda o categoría.</p>
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 text-center position-relative">
                {product.masVendido && (
                  <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
                    Más vendido
                  </span>
                )}
                {product.nuevo && (
                  <span className="badge bg-success position-absolute top-0 end-0 m-2">
                    Nuevo
                  </span>
                )}
                
                <img 
                  src={product.imagen} 
                  className="card-img-top catalogo-img" 
                  alt={product.nombre}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title">{product.nombre}</h5>
                  <p className="card-text small text-muted">{product.descripcion}</p>
                  <div className="fw-bold mb-2" style={{ color: '#B26673' }}>
                    {product.precio}
                  </div>
                  
                  <div className="d-flex gap-2 justify-content-center">
                    <Link 
                      to={`/detalle/${product.id}`} 
                      className="btn btn-outline-primary btn-sm"
                    >
                      Ver detalle
                    </Link>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-5 p-4 bg-light rounded-4">
        <h3 className="text-center mb-3" style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
          ¿No encuentras lo que buscas?
        </h3>
        <p className="text-center text-muted">
          Contamos con más de 1000 sabores y preparaciones especiales. 
          Contáctanos para pedidos personalizados y ocasiones especiales.
        </p>
        <div className="text-center">
          <a href="#" className="btn btn-outline-primary me-2">Contactar</a>
          <a href="#" className="btn btn-primary">WhatsApp</a>
        </div>
      </div>
    </div>
  )
}

export default Catalog