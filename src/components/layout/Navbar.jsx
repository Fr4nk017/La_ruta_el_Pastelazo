import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useProfile } from '../../contexts/ProfileContext'

function Navbar() {
  const location = useLocation()
  const { getItemCount } = useCart()
  const { isLoggedIn, user } = useProfile()
  const itemCount = getItemCount()

  const isActive = (path) => location.pathname === path

  return (
    <header className="py-3 border-bottom bg-white shadow-sm">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-3">
              <img 
                src="/imagenes/Logo la ruta el pastelazo.png" 
                alt="Logotipo Pastelería 1000 Sabores" 
                className="rounded"
                style={{ height: '60px', width: 'auto' }}
                loading="lazy"
              />
              <div>
                <h1 className="h4 m-0 navbar-brand">
                  Pastelería 1000 Sabores
                </h1>
                <p className="text-muted m-0 small">50 años de dulzura y tradición</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-8">
            <nav aria-label="Navegación principal" className="d-flex justify-content-end">
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                    to="/"
                    aria-current={isActive('/') ? 'page' : undefined}
                  >
                    <i className="bi bi-house me-1"></i>
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`} 
                    to="/catalogo"
                    aria-current={isActive('/catalogo') ? 'page' : undefined}
                  >
                    <i className="bi bi-grid me-1"></i>
                    Catálogo
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/carrito') ? 'active' : ''} position-relative`} 
                    to="/carrito"
                    aria-current={isActive('/carrito') ? 'page' : undefined}
                  >
                    <i className="bi bi-cart me-1"></i>
                    Carrito
                    {itemCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {itemCount}
                        <span className="visually-hidden">items en carrito</span>
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/estado') ? 'active' : ''}`} 
                    to="/estado"
                    aria-current={isActive('/estado') ? 'page' : undefined}
                  >
                    <i className="bi bi-truck me-1"></i>
                    Estado
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/reseñas') ? 'active' : ''}`} 
                    to="/reseñas"
                    aria-current={isActive('/reseñas') ? 'page' : undefined}
                  >
                    <i className="bi bi-star me-1"></i>
                    Reseñas
                  </Link>
                </li>
                {isLoggedIn ? (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${isActive('/perfil') ? 'active' : ''}`} 
                      to="/perfil"
                      aria-current={isActive('/perfil') ? 'page' : undefined}
                    >
                      <i className="bi bi-person me-1"></i>
                      {user?.name || 'Perfil'}
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${isActive('/ingresar') ? 'active' : ''}`} 
                      to="/ingresar"
                      aria-current={isActive('/ingresar') ? 'page' : undefined}
                    >
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Ingresar
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar