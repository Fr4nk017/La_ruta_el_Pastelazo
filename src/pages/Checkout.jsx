// Página de Checkout - La Ruta el Pastelazo
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, isValidEmail, isValidChileanPhone } from '../utils';
import { calcOrderTotal } from '../utils/pricing';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, summary, checkout } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    comuna: 'santiago',
    deliveryDate: '',
    deliveryTime: 'manana',
    paymentMethod: 'transferencia',
    specialInstructions: ''
  });

  // Redirigir si el carrito está vacío
  if (cart.length === 0 && !orderSuccess) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>🛒 Carrito Vacío</h2>
          <p>Agrega productos a tu carrito antes de proceder al checkout.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/catalog')}
            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
          >
            Ver Catálogo
          </Button>
        </div>
      </Container>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!isValidEmail(customerInfo.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!isValidChileanPhone(customerInfo.phone)) {
      newErrors.phone = 'Teléfono inválido';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!customerInfo.deliveryDate) {
      newErrors.deliveryDate = 'La fecha de entrega es requerida';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsProcessing(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrderId = checkout({
        fecha: customerInfo.deliveryDate,
        hora: customerInfo.deliveryTime,
        metodo: customerInfo.paymentMethod,
        comuna: customerInfo.comuna,
        customerInfo: customerInfo
      });
      
      setOrderId(newOrderId);
      setOrderSuccess(true);
      setIsProcessing(false);
      
    } catch (error) {
      setErrors({ general: 'Error al procesar el pedido. Intenta nuevamente.' });
      setIsProcessing(false);
    }
  };

  const orderTotal = calcOrderTotal(cart, { comuna: customerInfo.comuna });

  if (orderSuccess) {
    return (
      <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={6}>
              <Card className="border-0 shadow-lg text-center">
                <Card.Body className="p-5">
                  <div className="display-1 mb-3">🎉</div>
                  <h2 className="text-success mb-3">¡Pedido Confirmado!</h2>
                  <p className="lead mb-4">
                    Tu pedido <strong>#{orderId}</strong> ha sido recibido exitosamente.
                  </p>
                  
                  <div className="bg-light p-3 rounded mb-4">
                    <h6>Detalles de entrega:</h6>
                    <p className="mb-1">
                      📅 Fecha: {new Date(customerInfo.deliveryDate).toLocaleDateString('es-CL')}
                    </p>
                    <p className="mb-1">
                      🕐 Horario: {customerInfo.deliveryTime === 'manana' ? 'Mañana (9:00-13:00)' : 
                                  customerInfo.deliveryTime === 'tarde' ? 'Tarde (14:00-18:00)' : 
                                  'Noche (19:00-21:00)'}
                    </p>
                    <p className="mb-0">
                      📍 Dirección: {customerInfo.address}, {customerInfo.comuna}
                    </p>
                  </div>

                  <p className="text-muted mb-4">
                    Te contactaremos pronto para confirmar tu pedido y coordinar la entrega.
                  </p>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/tracking')}
                      style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                    >
                      📦 Seguir Pedido
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => navigate('/catalog')}
                      style={{ color: '#8B4513', borderColor: '#8B4513' }}
                    >
                      🍰 Seguir Comprando
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
      <Container className="py-4">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold" style={{ color: '#8B4513' }}>
            🛒 Finalizar Compra
          </h1>
          <p className="text-muted">Completa tu información para confirmar el pedido</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Información del Cliente */}
            <Col lg={7}>
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                  <h5 className="mb-0" style={{ color: '#8B4513' }}>
                    👤 Información Personal
                  </h5>
                </Card.Header>
                <Card.Body>
                  {errors.general && (
                    <Alert variant="danger" className="mb-3">
                      {errors.general}
                    </Alert>
                  )}

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Apellido *</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          placeholder="+56 9 1234 5678"
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Dirección de Entrega *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="Calle, número, depto, etc."
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Comuna *</Form.Label>
                    <Form.Select
                      name="comuna"
                      value={customerInfo.comuna}
                      onChange={handleInputChange}
                    >
                      <option value="santiago">Santiago Centro ($3.500)</option>
                      <option value="providencia">Providencia ($3.000)</option>
                      <option value="nunoa">Ñuñoa ($3.000)</option>
                      <option value="otras">Otras comunas ($4.500)</option>
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Entrega y Pago */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                  <h5 className="mb-0" style={{ color: '#8B4513' }}>
                    🚚 Entrega y Pago
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Entrega *</Form.Label>
                        <Form.Control
                          type="date"
                          name="deliveryDate"
                          value={customerInfo.deliveryDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          isInvalid={!!errors.deliveryDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.deliveryDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Horario de Entrega</Form.Label>
                        <Form.Select
                          name="deliveryTime"
                          value={customerInfo.deliveryTime}
                          onChange={handleInputChange}
                        >
                          <option value="manana">Mañana (9:00 - 13:00)</option>
                          <option value="tarde">Tarde (14:00 - 18:00)</option>
                          <option value="noche">Noche (19:00 - 21:00)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Método de Pago</Form.Label>
                    <Form.Select
                      name="paymentMethod"
                      value={customerInfo.paymentMethod}
                      onChange={handleInputChange}
                    >
                      <option value="transferencia">Transferencia Bancaria</option>
                      <option value="efectivo">Efectivo contra entrega</option>
                      <option value="tarjeta">Tarjeta de Débito/Crédito</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-0">
                    <Form.Label>Instrucciones Especiales</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="specialInstructions"
                      value={customerInfo.specialInstructions}
                      onChange={handleInputChange}
                      placeholder="Ej: Tocar timbre 2, entregar en portería, etc."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            {/* Resumen del Pedido */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                  <h5 className="mb-0" style={{ color: '#8B4513' }}>
                    📋 Resumen del Pedido
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {cart.map((item) => (
                      <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center px-0">
                        <div>
                          <h6 className="mb-1">{item.name}</h6>
                          <small className="text-muted">Cantidad: {item.qty}</small>
                        </div>
                        <span className="fw-bold">{formatPrice(item.price * item.qty)}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <hr />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatPrice(summary.total)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span>{formatPrice(orderTotal.envio)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold" style={{ color: '#8B4513' }}>
                    <span>Total:</span>
                    <span>{formatPrice(orderTotal.total)}</span>
                  </div>

                  <div className="d-grid mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isProcessing}
                      style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Procesando...
                        </>
                      ) : (
                        '🎉 Confirmar Pedido'
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Al confirmar, aceptas nuestros términos y condiciones
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}