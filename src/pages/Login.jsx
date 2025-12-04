import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, isAuthenticated } = useAuthAPI();
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      // Aquí iría la llamada a la API para enviar email de recuperación
      // Por ahora mostramos un mensaje de éxito simulado
      toast.success('Se ha enviado un enlace de recuperación a tu email');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (err) {
      toast.error('Error al enviar el enlace de recuperación');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Aquí iría la integración con OAuth de Google/Facebook
    // Por ahora mostramos un mensaje informativo
    toast.loading(`Iniciando sesión con ${provider}...`, {
      duration: 3000
    });
    
    // Simulamos la integración - en producción se usaría la SDK respectiva
    setTimeout(() => {
      toast.success(`Login con ${provider} en desarrollo`);
    }, 2000);
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

                  <div className="text-end mb-3">
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      <i className="fas fa-key me-1"></i>
                      ¿Olvidaste tu contraseña?
                    </button>
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

                <hr />

                <div className="text-center mb-3">
                  <p className="small text-muted mb-3">O inicia sesión con:</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleSocialLogin('Google')}
                      title="Iniciar sesión con Google"
                    >
                      <i className="fab fa-google"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleSocialLogin('Facebook')}
                      title="Iniciar sesión con Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </button>
                  </div>
                </div>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-primary fw-bold">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Recuperar Contraseña */}
      {showForgotPassword && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-key me-2"></i>
                  Recuperar Contraseña
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotPassword(false)}
                ></button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body">
                  <p className="text-muted">
                    Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
                  </p>
                  <div className="mb-3">
                    <label htmlFor="forgotEmail" className="form-label">
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar enlace
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;