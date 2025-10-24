import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // El redirect se maneja automáticamente por ProtectedRoute
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const demoUsers = [
    { email: 'admin@pastelazo.com', password: 'admin123', role: 'Admin' },
    { email: 'usuario@pastelazo.com', password: 'user123', role: 'Usuario' },
    { email: 'vendedor@pastelazo.com', password: 'vendor123', role: 'Vendedor' }
  ];

  const fillDemoUser = (userIndex) => {
    setEmail(demoUsers[userIndex].email);
    setPassword(demoUsers[userIndex].password);
    setError('');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="text-primary">
                    <i className="fas fa-birthday-cake me-2"></i>
                    La Ruta el Pastelazo
                  </h2>
                  <p className="text-muted">Inicia sesión en tu cuenta</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Tu contraseña"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </button>
                </form>

                <hr />
                
                <div className="text-center">
                  <p className="small text-muted mb-2">Usuarios de prueba:</p>
                  <div className="d-flex flex-column gap-2">
                    {demoUsers.map((user, index) => (
                      <button
                        key={index}
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => fillDemoUser(index)}
                        disabled={isLoading}
                      >
                        <i className="fas fa-user me-2"></i>
                        {user.role} - {user.email}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;