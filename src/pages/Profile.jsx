// Página de Perfil de Usuario - La Ruta el Pastelazo
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { formatPrice } from '../utils/currency';
import { formatDateTime } from '../utils/dates';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

// Componente de Login integrado
function LoginForm() {
  const { login, register, isLoading } = useAuthAPI();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login
      if (!formData.email || !formData.password) {
        setError('Por favor completa todos los campos');
        return;
      }

      const result = await login(formData);
      if (!result.success) {
        setError(result.error);
      }
    } else {
      // Registro
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('Por favor completa todos los campos obligatorios');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      const result = await register(formData);
      if (!result.success) {
        setError(result.error);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      // Aquí iría la llamada a la API para enviar email de recuperación
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
    toast.loading(`Iniciando sesión con ${provider}...`, {
      duration: 3000
    });
    
    setTimeout(() => {
      toast.success(`Login con ${provider} en desarrollo`);
    }, 2000);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE8CC 25%, #FFE0B8 50%, #FFD4A3 75%, #FFCB94 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative pastry elements */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '10%',
        fontSize: '3rem',
        opacity: 0.3,
        animation: 'float 6s ease-in-out infinite'
      }}>🍰</div>
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '15%',
        fontSize: '2.5rem',
        opacity: 0.3,
        animation: 'float 5s ease-in-out infinite 1s'
      }}>🧁</div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '15%',
        fontSize: '2rem',
        opacity: 0.3,
        animation: 'float 7s ease-in-out infinite 2s'
      }}>🍪</div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        fontSize: '2.8rem',
        opacity: 0.3,
        animation: 'float 5.5s ease-in-out infinite 1.5s'
      }}>🎂</div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '5%',
        fontSize: '2rem',
        opacity: 0.2,
        animation: 'float 6.5s ease-in-out infinite 0.5s'
      }}>🍩</div>
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '8%',
        fontSize: '2.2rem',
        opacity: 0.2,
        animation: 'float 6s ease-in-out infinite 2.5s'
      }}>🥐</div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: slideIn 0.6s ease-out; }
      `}</style>

      <Container className="py-5" style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
        <div className="slide-in">
          {/* Ilustración superior - Tema pastelería */}
          <div style={{
            background: 'linear-gradient(135deg, #D4A574 0%, #C19061 100%)',
            borderRadius: '20px 20px 0 0',
            padding: '40px 30px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 -10px 40px rgba(193, 144, 97, 0.4)'
          }}>
            {/* Decorative circles */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}></div>

            {/* Sweet shop illustration */}
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '15px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}>
              🍰🧁🍪
            </div>
            <h3 className="text-white fw-bold mb-2" style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              fontSize: '1.8rem'
            }}>
              Bienvenido a La Ruta
            </h3>
            <p className="text-white mb-0" style={{ 
              opacity: 0.95,
              fontSize: '0.95rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              Los mejores postres artesanales te esperan
            </p>
          </div>

          {/* Form card */}
          <Card className="border-0 shadow-lg" style={{
            borderRadius: '0 0 20px 20px',
            background: 'white'
          }}>
            <Card.Body className="px-4 py-4">
              {error && (
                <Alert 
                  variant="danger" 
                  className="py-3 mb-4"
                  style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)'
                  }}
                >
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  <small className="fw-bold">{error}</small>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1.1rem',
                            color: '#8B4513',
                            zIndex: 2
                          }}>👤</div>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required={!isLogin}
                            style={{
                              borderRadius: '25px',
                              padding: '12px 20px 12px 45px',
                              border: 'none',
                              fontSize: '0.9rem',
                              background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                              boxShadow: '0 4px 15px rgba(244, 228, 193, 0.4)',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '0 4px 15px rgba(244, 228, 193, 0.4)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1.1rem',
                            color: '#8B4513',
                            zIndex: 2
                          }}>👤</div>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Apellido"
                            required={!isLogin}
                            style={{
                              borderRadius: '25px',
                              padding: '12px 20px 12px 45px',
                              border: 'none',
                              fontSize: '0.9rem',
                              background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                              boxShadow: '0 4px 15px rgba(244, 228, 193, 0.4)',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '0 4px 15px rgba(244, 228, 193, 0.4)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Form.Group className="mb-3">
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.1rem',
                      color: '#8B4513',
                      zIndex: 2
                    }}>✉️</div>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email o Usuario"
                      required
                      style={{
                        borderRadius: '25px',
                        padding: '14px 20px 14px 50px',
                        border: 'none',
                        fontSize: '0.95rem',
                        background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                        boxShadow: '0 4px 15px rgba(244, 228, 193, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '0 4px 15px rgba(244, 228, 193, 0.4)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.1rem',
                      color: '#8B4513',
                      zIndex: 2
                    }}>🔒</div>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Contraseña"
                      required
                      style={{
                        borderRadius: '25px',
                        padding: '14px 20px 14px 50px',
                        border: 'none',
                        fontSize: '0.95rem',
                        background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                        boxShadow: '0 4px 15px rgba(244, 228, 193, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '0 4px 15px rgba(244, 228, 193, 0.4)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    />
                  </div>
                </Form.Group>

                {!isLogin && (
                  <>
                    <Form.Group className="mb-3">
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          left: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '1.1rem',
                          color: '#8B4513',
                          zIndex: 2
                        }}>📞</div>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Teléfono (opcional)"
                          style={{
                            borderRadius: '25px',
                            padding: '12px 20px 12px 45px',
                            border: 'none',
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                            boxShadow: '0 4px 15px rgba(244, 228, 193, 0.4)',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '0 4px 15px rgba(244, 228, 193, 0.4)';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          left: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '1.1rem',
                          color: '#8B4513',
                          zIndex: 2
                        }}>📍</div>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Dirección (opcional)"
                          style={{
                            borderRadius: '25px',
                            padding: '12px 20px 12px 45px',
                            border: 'none',
                            fontSize: '0.9rem',
                            background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                            boxShadow: '0 4px 15px rgba(244, 228, 193, 0.4)',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.3)';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '0 4px 15px rgba(244, 228, 193, 0.4)';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        />
                      </div>
                    </Form.Group>
                  </>
                )}

                {isLogin && (
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Recordarme"
                      style={{ 
                        color: '#666', 
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}
                    />
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none"
                      style={{
                        color: '#8B4513',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                      onClick={() => setShowForgotPassword(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-100 mb-3 border-0 fw-bold"
                  disabled={isLoading}
                  style={{
                    borderRadius: '25px',
                    padding: '14px',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 8px 20px rgba(139, 69, 19, 0.4)',
                    transition: 'all 0.3s ease',
                    color: 'white'
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 30px rgba(139, 69, 19, 0.6)';
                      e.target.style.background = 'linear-gradient(135deg, #6B3410 0%, #4A2410 100%)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 20px rgba(139, 69, 19, 0.4)';
                      e.target.style.background = 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Cargando...
                    </>
                  ) : (
                    isLogin ? '🔓 LOGIN' : '✨ REGISTRARSE'
                  )}
                </Button>
              </Form>

              <div className="text-center mb-3">
                <div className="d-flex gap-2 justify-content-center mb-3">
                  <Button
                    variant="outline-secondary"
                    className="flex-fill"
                    onClick={() => handleSocialLogin('Google')}
                    style={{
                      borderRadius: '25px',
                      padding: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F4E4C1 0%, #E8D4A8 100%)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      boxShadow: '0 4px 15px rgba(232, 212, 168, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(212, 165, 116, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(232, 212, 168, 0.4)';
                    }}
                  >
                    <i className="fab fa-google me-1" style={{ color: '#DB4437' }}></i>
                    <span style={{ color: '#5D4037' }}>Google</span>
                  </Button>

                  <Button
                    variant="outline-secondary"
                    className="flex-fill"
                    onClick={() => handleSocialLogin('Facebook')}
                    style={{
                      borderRadius: '25px',
                      padding: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #F4E4C1 0%, #E8D4A8 100%)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      boxShadow: '0 4px 15px rgba(232, 212, 168, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(212, 165, 116, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(232, 212, 168, 0.4)';
                    }}
                  >
                    <i className="fab fa-facebook me-1" style={{ color: '#1877F2' }}></i>
                    <span style={{ color: '#5D4037' }}>Facebook</span>
                  </Button>
                </div>
              </div>

              <div className="text-center pt-2">
                <span style={{ color: '#888', fontSize: '0.85rem' }}>
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                </span>
                {' '}
                <Button
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ firstName: '', lastName: '', email: '', password: '', phone: '', address: '' });
                  }}
                  style={{
                    color: '#8B4513',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>

      {/* Modal de Recuperar Contraseña */}
      {showForgotPassword && (
        <div 
          className="modal d-block" 
          tabIndex="-1" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div 
              className="modal-content border-0" 
              style={{
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-key me-2 text-primary"></i>
                  Recuperar Contraseña
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotPassword(false)}
                ></button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body px-4">
                  <p className="text-muted mb-4">
                    Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
                  </p>
                  <div className="mb-3">
                    <label htmlFor="forgotEmail" className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2 text-primary"></i>
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
                      style={{
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '2px solid #e2e8f0',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0 px-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowForgotPassword(false)}
                    style={{
                      borderRadius: '10px',
                      padding: '10px 20px',
                      fontWeight: '500'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn border-0"
                    disabled={forgotLoading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '10px',
                      padding: '10px 24px',
                      color: 'white',
                      fontWeight: '500',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
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
}

export default function Profile() {
  const { user, updateProfile, isAuthenticated } = useAuthAPI();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const lastOrderStorageKey = user?._id ? `lastOrderId:${user._id}` : null;

  // Actualizar formData cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      setOrderHistory([]);
      return;
    }

    let isMounted = true;
    setOrdersLoading(true);
    setOrdersError('');

    ordersAPI.getUserOrders()
      .then((data) => {
        if (!isMounted) return;
        const ordersList = data?.orders || data?.data?.orders || [];
        setOrderHistory(Array.isArray(ordersList) ? ordersList : []);
      })
      .catch((error) => {
        if (!isMounted) return;
        const message = error.response?.data?.message || 'No pudimos cargar tu historial de pedidos.';
        setOrdersError(message);
        setOrderHistory([]);
      })
      .finally(() => {
        if (isMounted) {
          setOrdersLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const getItemQuantity = (item = {}) => item.quantity ?? item.qty ?? 0;
  const getItemPrice = (item = {}) => item.price ?? item.productId?.price ?? 0;
  const calculateOrderTotal = (items = []) => items.reduce((total, item) => {
    return total + getItemPrice(item) * getItemQuantity(item);
  }, 0);

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'En preparación',
    ready: 'Listo',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };

  const statusVariants = {
    pending: 'warning',
    confirmed: 'info',
    preparing: 'primary',
    ready: 'success',
    delivered: 'success',
    cancelled: 'danger'
  };

  const getStatusLabel = (status) => statusLabels[status] || status || 'Pendiente';
  const getStatusVariant = (status) => statusVariants[status] || 'secondary';

  // Mostrar formulario de login si no está autenticado
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Perfil actualizado correctamente' });
      setIsEditing(false);
    } else {
      setMessage({ type: 'danger', text: `❌ Error: ${result.error}` });
    }
    
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const orderCount = orderHistory.length;

  return (
    <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold" style={{ color: '#8B4513' }}>
                👤 Mi Perfil
              </h1>
              <p className="text-muted">Gestiona tu información personal y revisa tus pedidos</p>
            </div>

            {message.text && (
              <Alert variant={message.type} className="mb-4">
                {message.text}
              </Alert>
            )}

            <Tabs defaultActiveKey="profile" className="mb-4">
              {/* TAB: Información Personal */}
              <Tab eventKey="profile" title="👤 Información Personal">
                <Card className="border-0 shadow-sm">
                  <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0" style={{ color: '#8B4513' }}>
                        Datos Personales
                      </h5>
                      <Button
                        variant={isEditing ? "success" : "outline-primary"}
                        size="sm"
                        onClick={() => {
                          if (isEditing) {
                            handleSaveProfile();
                          } else {
                            setIsEditing(true);
                          }
                        }}
                        style={!isEditing ? { color: '#8B4513', borderColor: '#8B4513' } : {}}
                      >
                        {isEditing ? '💾 Guardar' : '✏️ Editar'}
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ backgroundColor: isEditing ? 'white' : '#f8f9fa' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Apellido</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ backgroundColor: isEditing ? 'white' : '#f8f9fa' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ backgroundColor: isEditing ? 'white' : '#f8f9fa' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            style={{ backgroundColor: isEditing ? 'white' : '#f8f9fa' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    {isEditing && (
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,
                              phone: user.phone
                            });
                          }}
                        >
                          ❌ Cancelar
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              {/* TAB: Historial de Pedidos */}
              <Tab eventKey="orders" title={`📋 Mis Pedidos (${orderCount})`}>
                <Card className="border-0 shadow-sm">
                  <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                    <h5 className="mb-0" style={{ color: '#8B4513' }}>
                      Historial de Pedidos
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {ordersLoading && (
                      <div className="d-flex flex-column align-items-center justify-content-center py-4">
                        <Spinner animation="border" variant="warning" className="mb-3" />
                        <p className="text-muted mb-0">Cargando tu historial...</p>
                      </div>
                    )}

                    {!ordersLoading && ordersError && (
                      <Alert variant="danger" className="mb-0">
                        {ordersError}
                      </Alert>
                    )}

                    {!ordersLoading && !ordersError && orderCount > 0 && (
                      <div className="space-y-3">
                        {orderHistory.map((order) => {
                          const orderId = order._id || order.id;
                          const total = calculateOrderTotal(order.items);
                          const statusVariant = getStatusVariant(order.status);
                          const statusLabel = getStatusLabel(order.status);

                          return (
                            <Card key={orderId} className="mb-3 border-0 shadow-sm">
                              <Card.Body>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
                                  <div>
                                    <h6 className="mb-1">Pedido #{order.orderNumber || orderId}</h6>
                                    <small className="text-muted">
                                      {order.createdAt ? formatDateTime(order.createdAt) : 'Fecha no disponible'}
                                    </small>
                                  </div>
                                  <div className="text-md-end">
                                    <div className="fw-bold" style={{ color: '#8B4513' }}>
                                      {formatPrice(total)}
                                    </div>
                                    <span className={`badge bg-${statusVariant}`}>
                                      {statusLabel}
                                    </span>
                                  </div>
                                </div>

                                <div className="border-top pt-3">
                                  <small className="text-muted text-uppercase">Productos</small>
                                  <ul className="list-unstyled mb-0 mt-2">
                                    {order.items.map((item, index) => {
                                      const quantity = getItemQuantity(item);
                                      const price = getItemPrice(item) * quantity;
                                      return (
                                        <li key={`${orderId}-item-${index}`} className="small mb-1">
                                          • {item.productId?.name || item.name || 'Producto'} x{quantity} — {formatPrice(price)}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mt-3">
                                  <div className="text-muted small">
                                    Método de pago: {order.paymentMethod || 'No especificado'}
                                  </div>
                                  <div className="d-flex gap-2">
                                    <Button
                                      as={Link}
                                      to={`/tracking?id=${orderId}`}
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => {
                                        if (orderId && lastOrderStorageKey) {
                                          localStorage.setItem(lastOrderStorageKey, orderId);
                                        }
                                      }}
                                      style={{ borderColor: '#8B4513', color: '#8B4513' }}
                                    >
                                      🔍 Ver seguimiento
                                    </Button>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      disabled
                                    >
                                      Factura
                                    </Button>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {!ordersLoading && !ordersError && orderCount === 0 && (
                      <div className="text-center py-4">
                        <div className="display-1 mb-3">🛒</div>
                        <h5>No tienes pedidos aún</h5>
                        <p className="text-muted">
                          ¡Explora nuestro catálogo y haz tu primer pedido!
                        </p>
                        <Button 
                          variant="primary" 
                          href="/catalog"
                          style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                        >
                          Ver Catálogo
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              {/* TAB: Preferencias */}
              <Tab eventKey="preferences" title="⚙️ Preferencias">
                <Card className="border-0 shadow-sm">
                  <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                    <h5 className="mb-0" style={{ color: '#8B4513' }}>
                      Configuración de Cuenta
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="newsletter"
                        label="📧 Recibir newsletter con nuevos productos"
                        defaultChecked={user.preferences?.newsletter}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="promotions"
                        label="🎉 Recibir notificaciones de promociones"
                        defaultChecked={user.preferences?.promotions}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="birthday"
                        label="🎂 Recibir descuento especial en mi cumpleaños"
                        defaultChecked={false}
                      />
                    </Form.Group>
                    
                    <div className="border-top pt-3 mt-4">
                      <h6 style={{ color: '#8B4513' }}>Zona de Peligro</h6>
                      <p className="text-muted small">
                        Estas acciones son permanentes y no se pueden deshacer.
                      </p>
                      <Button variant="outline-danger" size="sm">
                        🗑️ Eliminar Cuenta
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
}