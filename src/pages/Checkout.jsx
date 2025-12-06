// Página de Checkout Mejorada - La Ruta el Pastelazo
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge, ProgressBar, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../utils/currency';
import { isValidEmail, isValidChileanPhone } from '../utils/validation';
import { getImageUrl, handleImageError } from '../utils/images';
import { calcOrderTotal } from '../utils/pricing';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, checkout, clear } = useCart();
  const { user, isAuthenticated } = useAuthAPI();
  const lastOrderStorageKey = user?._id ? `lastOrderId:${user._id}` : null;
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    comuna: 'santiago',
    reference: '',
    deliveryDate: '',
    deliveryTime: 'manana',
    paymentMethod: 'transferencia',
    specialInstructions: '',
    acceptTerms: false
  });

  // Calcular totales con cupón
  const orderTotal = calcOrderTotal(cart, { 
    comuna: customerInfo.comuna, 
    cupon: couponApplied ? couponCode : '' 
  });

  // Redirigir si el carrito está vacío
  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <div className="text-center">
            <div className="display-1 mb-3">🛒</div>
            <h2 style={{ color: '#8B4513' }}>Carrito Vacío</h2>
            <p className="text-muted mb-4">Agrega productos a tu carrito antes de proceder al checkout.</p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/catalog')}
              style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
            >
              🍰 Ver Catálogo
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const applyCoupon = () => {
    const validCoupons = {
      'DULCE10': { discount: 0.1, name: '10% de descuento' },
      'PASTEL5': { discount: 0.05, name: '5% de descuento' },
      'BIENVENIDO': { discount: 0.15, name: '15% de descuento' }
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setCouponApplied(true);
      setErrors(prev => ({ ...prev, coupon: '' }));
    } else {
      setErrors(prev => ({ ...prev, coupon: 'Cupón inválido' }));
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step >= 1) {
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
        newErrors.phone = 'Formato: +56912345678 o 912345678';
      }
    }

    if (step >= 2) {
      if (!customerInfo.address.trim()) {
        newErrors.address = 'La dirección es requerida';
      }
      if (!customerInfo.deliveryDate) {
        newErrors.deliveryDate = 'La fecha de entrega es requerida';
      } else {
        const selectedDate = new Date(customerInfo.deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.deliveryDate = 'La fecha debe ser hoy o posterior';
        }
      }
    }

    if (step >= 3) {
      if (!customerInfo.acceptTerms) {
        newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
      }
    }

    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateStep(3);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    try {
      console.log('🛒 Starting order creation...');
      console.log('🛒 Cart contents:', cart);
      // Preparar datos para la API
      const orderData = {
        items: cart.map(item => {
          console.log('📦 Processing item:', item);
          return {
            productId: item._id || item.id, // Usar _id si existe, sino id como fallback
            quantity: item.qty
          };
        }),
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          comuna: customerInfo.comuna,
          reference: customerInfo.reference || ''
        },
        deliveryDate: customerInfo.deliveryDate,
        deliveryTime: customerInfo.deliveryTime,
        paymentMethod: customerInfo.paymentMethod,
        specialInstructions: customerInfo.specialInstructions || '',
        couponCode: couponApplied ? couponCode : ''
      };

      console.log('📦 Order data prepared:', orderData);
      console.log('📦 Order data JSON:', JSON.stringify(orderData, null, 2));
      console.log('📦 Cart contents detail:', cart.map(item => ({ id: item._id || item.id, name: item.name, qty: item.qty })));
      console.log('📦 CustomerInfo keys:', Object.keys(orderData.customerInfo));
      console.log('📦 All keys in orderData:', Object.keys(orderData));
      console.log('📦 Items validation:', orderData.items.map((item, i) => ({ index: i, productId: item.productId, quantity: item.quantity })));

      // PRIMERO: Hacer un test para verificar que el servidor recibe los datos correctamente
      console.log('🧪 Testing if server receives data correctly...');
      try {
        const testResponse = await fetch('https://la-ruta-el-pastelazo-backend.vercel.app/test-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        const testData = await testResponse.json();
        console.log('🧪 Test response:', testData);
      } catch (testError) {
        console.error('🧪 Test failed:', testError);
      }

      // Crear orden en el backend
      const response = await ordersAPI.create(orderData);
      
      console.log('✅ Order created successfully:', response);
      
      // Usar _id de la orden para seguimiento
      const newOrderId = response.data._id || response.data.orderNumber;
      setOrderId(newOrderId);
      // Guardar el último orderId en localStorage para fallback en seguimiento
      if (newOrderId && lastOrderStorageKey) {
        localStorage.setItem(lastOrderStorageKey, newOrderId);
      }
      setOrderSuccess(true);
      setIsProcessing(false);
      clear(); // Limpiar carrito después del pedido exitoso
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      let errorMessage = 'Error al procesar el pedido. Intenta nuevamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.missingFields) {
        errorMessage = `Faltan campos: ${error.response.data.missingFields.join(', ')}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Final error message:', errorMessage);
      setErrors({ general: errorMessage });
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow-lg text-center">
                <Card.Body className="p-5">
                  <div className="display-1 mb-4">🎉</div>
                  <h2 className="text-success mb-3 font-pacifico">¡Pedido Confirmado!</h2>
                  <p className="lead mb-4">
                    Tu pedido <Badge bg="primary" className="fs-6">#{orderId}</Badge> ha sido recibido exitosamente.
                  </p>
                  <Alert variant="info" className="mb-4">
                    <strong>📞 ¿Qué sigue?</strong><br/>
                    Te contactaremos en las próximas 2 horas para confirmar tu pedido y coordinar la entrega.
                  </Alert>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => navigate(`/tracking?id=${orderId}`)}
                      style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                    >
                      📦 Seguir Pedido
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="lg"
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

  const steps = [
    { number: 1, title: 'Información', icon: '👤' },
    { number: 2, title: 'Entrega', icon: '🚚' },
    { number: 3, title: 'Confirmar', icon: '✅' }
  ];

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        {/* Header con progreso */}
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold font-pacifico mb-3" style={{ color: '#8B4513' }}>
            🛒 Finalizar Compra
          </h1>
          
          {/* Indicador de progreso */}
          <Row className="justify-content-center mb-4">
            <Col md={8}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                {steps.map((step) => (
                  <div key={step.number} className="text-center">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                        currentStep >= step.number 
                          ? 'bg-primary text-white' 
                          : 'bg-light text-muted border'
                      }`}
                      style={{ width: '50px', height: '50px' }}
                    >
                      {currentStep > step.number ? '✓' : step.icon}
                    </div>
                    <small className={currentStep >= step.number ? 'text-primary fw-bold' : 'text-muted'}>
                      {step.title}
                    </small>
                  </div>
                ))}
              </div>
              <ProgressBar 
                now={(currentStep / 3) * 100} 
                style={{ height: '8px' }}
                variant="primary"
              />
            </Col>
          </Row>
        </div>

        {isProcessing && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
               style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
            <Card className="text-center p-4">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <h5>Procesando tu pedido...</h5>
              <p className="text-muted mb-0">Por favor espera...</p>
            </Card>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Formulario principal */}
            <Col lg={8}>
              {/* Paso 1: Información Personal */}
              {currentStep === 1 && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      👤 Información Personal
                    </h5>
                  </Card.Header>
                  <Card.Body>
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
                            placeholder="Tu nombre"
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
                            placeholder="Tu apellido"
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
                            placeholder="tu@email.com"
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
                            isInvalid={!!errors.phone}
                            placeholder="+56912345678"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="primary" 
                        onClick={nextStep}
                        style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                      >
                        Continuar 👉
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Paso 2: Entrega y Pago */}
              {currentStep === 2 && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      🚚 Entrega y Pago
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <h6 className="text-muted mb-3">📍 Dirección de entrega</h6>
                    <Row>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Dirección completa *</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={customerInfo.address}
                            onChange={handleInputChange}
                            isInvalid={!!errors.address}
                            placeholder="Ej: Av. Providencia 1234, Depto 502"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.address}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Comuna *</Form.Label>
                          <Form.Select
                            name="comuna"
                            value={customerInfo.comuna}
                            onChange={handleInputChange}
                          >
                            <option value="santiago">Santiago</option>
                            <option value="providencia">Providencia</option>
                            <option value="nunoa">Ñuñoa</option>
                            <option value="las-condes">Las Condes</option>
                            <option value="vitacura">Vitacura</option>
                            <option value="otras">Otras comunas</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <h6 className="text-muted mb-3">🕐 Horario de entrega</h6>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Fecha de entrega *</Form.Label>
                          <Form.Control
                            type="date"
                            name="deliveryDate"
                            value={customerInfo.deliveryDate}
                            onChange={handleInputChange}
                            isInvalid={!!errors.deliveryDate}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.deliveryDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Horario preferido *</Form.Label>
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

                    <h6 className="text-muted mb-3">💳 Método de pago</h6>
                    <div className="mb-4">
                      <Form.Check
                        type="radio"
                        id="transferencia"
                        name="paymentMethod"
                        value="transferencia"
                        label="💸 Transferencia bancaria"
                        checked={customerInfo.paymentMethod === 'transferencia'}
                        onChange={handleInputChange}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        id="efectivo"
                        name="paymentMethod"
                        value="efectivo"
                        label="💵 Efectivo contra entrega"
                        checked={customerInfo.paymentMethod === 'efectivo'}
                        onChange={handleInputChange}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        id="tarjeta"
                        name="paymentMethod"
                        value="tarjeta"
                        label="💳 Tarjeta de crédito/débito"
                        checked={customerInfo.paymentMethod === 'tarjeta'}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={prevStep}>
                        👈 Atrás
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={nextStep}
                        style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                      >
                        Continuar 👉
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Paso 3: Confirmación */}
              {currentStep === 3 && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      ✅ Confirmación del Pedido
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={customerInfo.acceptTerms}
                        onChange={handleInputChange}
                        isInvalid={!!errors.acceptTerms}
                        label="Acepto los términos y condiciones *"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.acceptTerms}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={prevStep}>
                        👈 Atrás
                      </Button>
                      <Button 
                        variant="success" 
                        type="submit"
                        size="lg"
                        disabled={!customerInfo.acceptTerms}
                      >
                        🎉 Confirmar Pedido
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>

            {/* Resumen del pedido */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <Card.Header className="bg-white">
                  <h5 className="mb-0">📋 Resumen del Pedido</h5>
                </Card.Header>
                <Card.Body>
                  {/* Productos */}
                  <ListGroup variant="flush" className="mb-3">
                    {cart.map(item => (
                      <ListGroup.Item key={item.id} className="px-0 py-2">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={getImageUrl(item.image || item.img)} 
                            alt={item.name}
                            onError={handleImageError}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-0 small">{item.name}</h6>
                            <small className="text-muted">
                              {formatPrice(item.price)} × {item.qty}
                            </small>
                          </div>
                          <strong className="small">{formatPrice(item.price * item.qty)}</strong>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {/* Totales */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderTotal.subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Envío</span>
                      <span>{formatPrice(orderTotal.envio)}</span>
                    </div>
                    {orderTotal.desc > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Descuento</span>
                        <span>-{formatPrice(orderTotal.desc)}</span>
                      </div>
                    )}
                    <hr/>
                    <div className="d-flex justify-content-between h5">
                      <span>Total</span>
                      <strong style={{ color: '#8B4513' }}>{formatPrice(orderTotal.total)}</strong>
                    </div>
                  </div>

                  <Alert variant="info" className="small">
                    <strong>💡 Te contactaremos para confirmar</strong>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>

        {/* Modal de confirmación */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>🎉 Confirmar Pedido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro que deseas confirmar tu pedido por <strong>{formatPrice(orderTotal.total)}</strong>?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="success" onClick={confirmOrder}>
              ✅ Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}