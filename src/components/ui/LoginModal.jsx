// Modal de Login - La Ruta el Pastelazo
import { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuthAPI } from '../../contexts/AuthContextAPI';

export default function LoginModal({ show, onHide, onSwitchToRegister }) {
  const { login, isLoading } = useAuthAPI();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

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

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      setFormData({ email: '', password: '' });
      onHide();
    } else {
      setError(result.error);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center">
          <div className="mb-2">🍰</div>
          <h4>Iniciar Sesión</h4>
          <small className="text-muted">Accede a tu cuenta de La Ruta el Pastelazo</small>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4">
        {error && (
          <Alert variant="danger" className="py-2">
            <small>{error}</small>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </Form.Group>
          
          <div className="d-grid mb-3">
            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0 flex-column">
        <div className="text-center">
          <small className="text-muted">
            ¿No tienes cuenta?{' '}
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={onSwitchToRegister}
            >
              Regístrate aquí
            </Button>
          </small>
        </div>
      </Modal.Footer>
    </Modal>
  );
}