import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container my-5">
      <div className="text-center">
        <h1 className="display-1" style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
          404
        </h1>
        <h2 className="mb-4">Página no encontrada</h2>
        <p className="text-muted mb-4">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound