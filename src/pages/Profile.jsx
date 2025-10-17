// Página de Perfil de Usuario - La Ruta el Pastelazo
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { formatPrice, formatDateTime } from '../utils';

export default function Profile() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const { orders } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>🔒 Acceso Restringido</h2>
          <p>Debes iniciar sesión para ver tu perfil.</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </Container>
    );
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

  const userOrders = orders.filter(order => order.customerInfo?.email === user.email);

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
              <Tab eventKey="orders" title={`📋 Mis Pedidos (${userOrders.length})`}>
                <Card className="border-0 shadow-sm">
                  <Card.Header style={{ backgroundColor: '#F5DEB3' }}>
                    <h5 className="mb-0" style={{ color: '#8B4513' }}>
                      Historial de Pedidos
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {userOrders.length > 0 ? (
                      <div className="space-y-3">
                        {userOrders.map((order) => (
                          <Card key={order.id} className="mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">Pedido #{order.id}</h6>
                                  <small className="text-muted">
                                    {formatDateTime(order.createdAt)}
                                  </small>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold" style={{ color: '#8B4513' }}>
                                    {formatPrice(order.items.reduce((total, item) => total + (item.price * item.qty), 0))}
                                  </div>
                                  <small className="badge bg-success">
                                    {order.status || 'Pendiente'}
                                  </small>
                                </div>
                              </div>
                              
                              <div className="border-top pt-2">
                                <small className="text-muted">Productos:</small>
                                <ul className="list-unstyled mb-0 mt-1">
                                  {order.items.map((item, index) => (
                                    <li key={index} className="small">
                                      • {item.name} x{item.qty} - {formatPrice(item.price * item.qty)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    ) : (
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