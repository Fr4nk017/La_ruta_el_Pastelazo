import { useProfile } from '../contexts/ProfileContext'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { user, logout } = useProfile()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <h2>Acceso requerido</h2>
          <p className="text-muted">Debes iniciar sesión para ver tu perfil.</p>
          <a href="/ingresar" className="btn btn-primary">Iniciar sesión</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header">
              <h2 className="mb-0" style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
                Mi Perfil
              </h2>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-sm-3">
                  <strong>Nombre:</strong>
                </div>
                <div className="col-sm-9">
                  {user.name}
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-sm-3">
                  <strong>Email:</strong>
                </div>
                <div className="col-sm-9">
                  {user.email}
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-sm-3">
                  <strong>Cliente desde:</strong>
                </div>
                <div className="col-sm-9">
                  {new Date().getFullYear()}
                </div>
              </div>
              
              <hr />
              
              <div className="d-flex gap-2">
                <button className="btn btn-primary">Editar perfil</button>
                <button className="btn btn-outline-secondary">Historial de pedidos</button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile