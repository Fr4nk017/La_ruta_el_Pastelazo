import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { PRODUCTOS } from '../utils/mockProducts'

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addItem } = useCart()
  
  const carouselImages = [
    {
      src: '/imagenes/tortas/Guinnes.jpg',
      alt: 'Récord Guinness torta más grande del mundo',
      title: '¡Bienvenidos a Pastelería 1000 Sabores!',
      subtitle: 'Referente en la repostería chilena desde 1975.\n¡Récord Guinness de la torta más grande del mundo!'
    },
    {
      src: '/imagenes/tortas/Torta Especial de Cumpleaños.png',
      alt: 'Tortas especiales para celebraciones',
      title: '50 años endulzando Chile',
      subtitle: 'Celebra con nosotros medio siglo de tradición y sabor.'
    },
    {
      src: '/imagenes/tortas/Torta_Circular_de_Vainilla.png',
      alt: 'Nuestras especialidades',
      title: 'Calidad en cada bocado',
      subtitle: 'Ingredientes frescos y recetas tradicionales.'
    }
  ]

  const featuredProducts = Object.entries(PRODUCTOS)
    .filter(([, product]) => product.masVendido || product.nuevo)
    .slice(0, 6)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [carouselImages.length])

  return (
    <div className="container my-5">
      {/* Carrusel destacado */}
      <section className="mb-5">
        <div id="carouselPrincipal" className="carousel slide shadow-lg rounded-4 overflow-hidden position-relative" data-bs-ride="carousel">
          <div className="carousel-inner">
            {carouselImages.map((image, index) => (
              <div 
                key={index} 
                className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
              >
                <img 
                  src={image.src} 
                  className="d-block w-100" 
                  style={{ height: '400px', objectFit: 'cover' }}
                  alt={image.alt} 
                />
                <div className="carousel-caption d-none d-md-block">
                  <div className="bg-dark bg-opacity-75 rounded-3 p-4">
                    <h2 className="display-6 mb-3" style={{ fontFamily: "'Pacifico', cursive", color: 'white' }}>
                      {image.title}
                    </h2>
                    <p className="lead text-white" style={{ whiteSpace: 'pre-line' }}>
                      {image.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Controles del carrusel */}
          <button 
            className="carousel-control-prev" 
            type="button" 
            onClick={() => setCurrentSlide(currentSlide === 0 ? carouselImages.length - 1 : currentSlide - 1)}
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button 
            className="carousel-control-next" 
            type="button"
            onClick={() => setCurrentSlide((currentSlide + 1) % carouselImages.length)}
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
          
          {/* Indicadores del carrusel */}
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === currentSlide ? 'active' : ''}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontFamily: "'Pacifico', cursive" }}>Productos destacados</h2>
          <Link to="/catalogo" className="btn btn-outline-primary">
            Ver catálogo completo
          </Link>
        </div>
        
        <div className="row g-4">
          {featuredProducts.map(([id, product]) => (
            <div key={id} className="col-md-6 col-lg-4">
              <div className="card product-card h-100 shadow border-0 text-center position-relative fade-in">
                {product.masVendido && (
                  <span className="badge badge-bestseller position-absolute top-0 start-0 m-2 z-index-1">
                    Más vendido
                  </span>
                )}
                {product.nuevo && (
                  <span className="badge badge-new position-absolute top-0 end-0 m-2 z-index-1">
                    Nuevo
                  </span>
                )}
                <div className="overflow-hidden">
                  <img 
                    src={product.imagen} 
                    className="card-img-top" 
                    alt={product.nombre}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                </div>
                <div className="card-body d-flex flex-column justify-content-between p-4">
                  <div>
                    <h5 className="card-title mb-2" style={{ color: 'var(--choco)' }}>
                      {product.nombre}
                    </h5>
                    <p className="card-text small text-muted mb-3">
                      {product.descripcion}
                    </p>
                  </div>
                  <div>
                    <div className="price mb-3">
                      {product.precio}
                    </div>
                    <div className="d-flex gap-2">
                      <Link 
                        to={`/detalle/${id}`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        Ver detalle
                      </Link>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const cartItem = {
                            id,
                            name: product.nombre,
                            price: parseInt(product.precio.replace(/[^\d]/g, '')),
                            image: product.imagen
                          }
                          addItem(cartItem)
                        }}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Información de la empresa */}
      <section className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 text-center border-0 shadow-lg">
            <div className="card-body p-4">
              <div className="mb-3">
                <i className="bi bi-award fs-1" style={{ color: 'var(--choco)' }}></i>
              </div>
              <h3 className="mb-3" style={{ fontFamily: "'Pacifico', cursive", color: 'var(--choco)' }}>
                50 años de experiencia
              </h3>
              <p className="text-muted">
                Desde 1975, hemos sido referente en la repostería chilena, 
                manteniendo la tradición familiar y la calidad artesanal.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 text-center border-0 shadow-lg">
            <div className="card-body p-4">
              <div className="mb-3">
                <i className="bi bi-trophy fs-1" style={{ color: 'var(--choco)' }}></i>
              </div>
              <h3 className="mb-3" style={{ fontFamily: "'Pacifico', cursive", color: 'var(--choco)' }}>
                Récord Guinness
              </h3>
              <p className="text-muted">
                Orgullosos poseedores del récord mundial de la torta más grande, 
                demostrando nuestra capacidad y dedicación.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 text-center border-0 shadow-lg">
            <div className="card-body p-4">
              <div className="mb-3">
                <i className="bi bi-heart fs-1" style={{ color: 'var(--choco)' }}></i>
              </div>
              <h3 className="mb-3" style={{ fontFamily: "'Pacifico', cursive", color: 'var(--choco)' }}>
                Ingredientes frescos
              </h3>
              <p className="text-muted">
                Utilizamos solo los mejores ingredientes, seleccionados 
                cuidadosamente para garantizar el sabor auténtico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center py-5 bg-light rounded-4">
        <h2 className="mb-3" style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
          ¿Listo para endulzar tu día?
        </h2>
        <p className="lead text-muted mb-4">
          Explora nuestro catálogo completo y descubre todos los sabores que tenemos para ti.
        </p>
        <Link to="/catalogo" className="btn btn-primary btn-lg">
          Explorar catálogo
        </Link>
      </section>
    </div>
  )
}

export default Home