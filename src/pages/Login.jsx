import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../contexts/ProfileContext'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLogin, setIsLogin] = useState(true)
  const { login } = useProfile()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulación de login exitoso
    const userData = {
      name: isLogin ? 'Usuario Demo' : formData.name,
      email: formData.email,
      id: Date.now()
    }
    
    login(userData)
    navigate('/')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
                {isLogin ? 'Ingresar' : 'Registrarse'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre completo</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
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
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100 mb-3">
                  {isLogin ? 'Ingresar' : 'Registrarse'}
                </button>
              </form>
              
              <div className="text-center">
                <button 
                  className="btn btn-link p-0"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login