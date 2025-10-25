
// Página de Carrito - La Ruta el Pastelazo
import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { calcOrderTotal } from '../utils/pricing';
import { formatPrice } from '../utils/currency';
import { getImageUrl, handleImageError } from '../utils/images';

export default function CartPage(){
  const { cart, add, dec, remove, clear, checkout } = useCart();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [comuna, setComuna] = useState('santiago');
  const [cupon, setCupon] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  
  const totals = calcOrderTotal(cart, { comuna, cupon });
  
  const onCheckout = (e) => {
    e.preventDefault();
    if(!fecha || !hora) {
      alert('Por favor selecciona fecha y hora de entrega');
      return;
    }
    const id = checkout({ fecha, hora, metodo:'whatsapp', comuna, cupon });
    if(id) {
      setShowSuccess(true);
      setTimeout(() => navigate(`/tracking?id=${id}`), 2000);
    }
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty <= 0) {
      remove(itemId);
    } else {
      const item = cart.find(item => item.id === itemId);
      if (item) {
        if (newQty > item.qty) {
          add(item);
        } else {
          dec(itemId);
        }
      }
    }
  };

  if(!cart.length){ 
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <Card className="border-0 shadow-sm p-5">
                <div className="display-1 mb-3">🛒</div>
                <h2 className="mb-3" style={{ color: '#8B4513' }}>Tu carrito está vacío</h2>
                <p className="text-muted mb-4">¡Descubre nuestros deliciosos productos y comienza tu pedido!</p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/catalog')}
                  style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                >
                  🍰 Ver Catálogo
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold font-pacifico" style={{ color: '#8B4513' }}>
            🛒 Tu Carrito
          </h1>
          <p className="text-muted">
            Revisa y confirma tu pedido
          </p>
          <Badge bg="primary" className="fs-6">
            {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
          </Badge>
        </div>

        {showSuccess && (
          <Alert variant="success" className="text-center">
            <h5>¡Pedido enviado exitosamente! 🎉</h5>
            <p>Serás redirigido al seguimiento...</p>
          </Alert>
        )}

        <Row className="g-4">
          {/* Productos del carrito */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Productos en tu carrito</h5>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={clear}
                    className="d-flex align-items-center gap-2"
                  >
                    🗑️ Vaciar carrito
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {cart.map(item => (
                    <ListGroup.Item key={item.id} className="py-3">
                      <Row className="align-items-center">
                        <Col md={2}>
                          <Image 
                            src={getImageUrl(item.image || item.img)} 
                            alt={item.name}
                            rounded
                            onError={handleImageError}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          />
                        </Col>
                        <Col md={4}>
                          <h6 className="mb-1">{item.name}</h6>
                          <p className="text-muted small mb-0">
                            {formatPrice(item.price)} c/u
                          </p>
                        </Col>
                        <Col md={3}>
                          <div className="d-flex align-items-center gap-2">
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => dec(item.id)}
                              disabled={item.qty <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2 fw-bold">{item.qty}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => add(item)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        <Col md={2} className="text-end">
                          <div className="fw-bold">{formatPrice(item.price * item.qty)}</div>
                        </Col>
                        <Col md={1} className="text-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => remove(item.id)}
                          >
                            ×
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Resumen y checkout */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <Card.Header className="bg-white">
                <h5 className="mb-0">Resumen del pedido</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={onCheckout}>
                  {/* Información de entrega */}
                  <div className="mb-3">
                    <h6 className="text-muted">📅 Entrega</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control 
                        type="date" 
                        value={fecha} 
                        onChange={e => setFecha(e.target.value)} 
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Hora</Form.Label>
                      <Form.Control 
                        type="time" 
                        value={hora} 
                        onChange={e => setHora(e.target.value)} 
                        required
                      />
                    </Form.Group>
                  </div>

                  {/* Comuna */}
                  <div className="mb-3">
                    <h6 className="text-muted">📍 Ubicación</h6>
                    <Form.Select 
                      value={comuna} 
                      onChange={e => setComuna(e.target.value)}
                    >
                      <option value="santiago">Santiago</option>
                      <option value="providencia">Providencia</option>
                      <option value="nunoa">Ñuñoa</option>
                      <option value="otras">Otras comunas</option>
                    </Form.Select>
                  </div>

                  {/* Cupón */}
                  <div className="mb-3">
                    <h6 className="text-muted">🎟️ Cupón de descuento</h6>
                    <Form.Control 
                      value={cupon} 
                      onChange={e => setCupon(e.target.value.toUpperCase())} 
                      placeholder="DULCE10 / PASTEL5"
                    />
                    <Form.Text className="text-muted">
                      Ingresa tu código de descuento
                    </Form.Text>
                  </div>

                  <hr/>

                  {/* Totales */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <strong>{formatPrice(totals.subtotal)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Envío</span>
                      <strong>{formatPrice(totals.envio)}</strong>
                    </div>
                    {totals.desc > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Descuento</span>
                        <strong>-{formatPrice(totals.desc)}</strong>
                      </div>
                    )}
                    <hr/>
                    <div className="d-flex justify-content-between h5">
                      <span>Total</span>
                      <strong style={{ color: '#8B4513' }}>{formatPrice(totals.total)}</strong>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      type="submit"
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      📱 Confirmar por WhatsApp
                    </Button>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/checkout')}
                      style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      🛒 Checkout Completo
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
