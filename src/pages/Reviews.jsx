// Página de Reseñas - La Ruta el Pastelazo
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { formatDateTime } from '../utils';

export default function Reviews() {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    productName: '',
    rating: 5,
    title: '',
    comment: '',
    category: 'tortas'
  });
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Datos de ejemplo para las reseñas
  useEffect(() => {
    const sampleReviews = [
      {
        id: 1,
        customerName: 'María González',
        productName: 'Torta de Chocolate',
        rating: 5,
        title: '¡Excelente calidad!',
        comment: 'La torta estaba deliciosa, muy fresca y el chocolate de primera calidad. La recomiendo 100%. El servicio de entrega también fue muy puntual.',
        date: new Date(2024, 0, 15),
        category: 'tortas',
        verified: true
      },
      {
        id: 2,
        customerName: 'Carlos Ruiz',
        productName: 'Empanada de Manzana',
        rating: 4,
        title: 'Muy rica, pero un poco dulce',
        comment: 'La empanada estaba muy bien hecha, crujiente por fuera y suave por dentro. Solo que para mi gusto estaba un poco dulce.',
        date: new Date(2024, 0, 12),
        category: 'reposteria',
        verified: true
      },
      {
        id: 3,
        customerName: 'Ana Martínez',
        productName: 'Tiramisú Clásico',
        rating: 5,
        title: 'Simplemente perfecto',
        comment: 'El mejor tiramisú que he probado en Santiago. Los sabores estaban perfectamente balanceados y la textura era increíble.',
        date: new Date(2024, 0, 10),
        category: 'postres',
        verified: true
      },
      {
        id: 4,
        customerName: 'Pedro Silva',
        productName: 'Torta de Cumpleaños Personalizada',
        rating: 5,
        title: 'Superó mis expectativas',
        comment: 'Pedí una torta personalizada para el cumpleaños de mi hija y quedó hermosa. No solo se veía increíble, sino que también estaba deliciosa.',
        date: new Date(2024, 0, 8),
        category: 'tortas',
        verified: true
      },
      {
        id: 5,
        customerName: 'Laura Herrera',
        productName: 'Cheesecake de Frambuesa',
        rating: 4,
        title: 'Muy bueno, volveré a comprar',
        comment: 'El cheesecake tenía muy buen sabor y la presentación era excelente. Lo único es que me gustaría que tuviera más frambuesas.',
        date: new Date(2024, 0, 5),
        category: 'cheesecakes',
        verified: true
      },
      {
        id: 6,
        customerName: 'Roberto Castillo',
        productName: 'Brownie sin Gluten',
        rating: 5,
        title: 'Perfecto para celíacos',
        comment: 'Como celíaco, es difícil encontrar brownies que sepan bien. Este estaba increíble, ni siquiera se notaba que era sin gluten.',
        date: new Date(2024, 0, 3),
        category: 'sin-gluten',
        verified: true
      }
    ];
    setReviews(sampleReviews);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
    
    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const formErrors = {};
    
    if (!newReview.productName.trim()) {
      formErrors.productName = 'El nombre del producto es requerido';
    }
    
    if (!newReview.title.trim()) {
      formErrors.title = 'El título es requerido';
    }
    
    if (!newReview.comment.trim()) {
      formErrors.comment = 'El comentario es requerido';
    } else if (newReview.comment.length < 10) {
      formErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    }
    
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const review = {
      id: reviews.length + 1,
      customerName: user?.firstName + ' ' + user?.lastName || 'Usuario Anónimo',
      ...newReview,
      date: new Date(),
      verified: isAuthenticated
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({
      productName: '',
      rating: 5,
      title: '',
      comment: '',
      category: 'tortas'
    });
    setShowModal(false);
    setSuccessMessage('¡Gracias por tu reseña! Ha sido publicada exitosamente.');
    
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={interactive ? 'cursor-pointer' : ''}
        style={{ 
          color: index < rating ? '#FFD700' : '#ddd',
          fontSize: '1.2em',
          cursor: interactive ? 'pointer' : 'default'
        }}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
      >
        ★
      </span>
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const ratingMatch = filterRating === 'all' || review.rating.toString() === filterRating;
    const categoryMatch = filterCategory === 'all' || review.category === filterCategory;
    return ratingMatch && categoryMatch;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Encabezado */}
        <div className="text-center mb-5">
          <h1 className="display-6 fw-bold" style={{ color: '#8B4513' }}>
            ⭐ Reseñas y Testimonios
          </h1>
          <p className="text-muted">Lo que dicen nuestros clientes sobre nuestros productos</p>
        </div>

        {/* Estadísticas y Botón para Nueva Reseña */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row className="text-center">
                  <Col xs={6} md={3}>
                    <div className="display-6 fw-bold" style={{ color: '#8B4513' }}>
                      {reviews.length}
                    </div>
                    <small className="text-muted">Reseñas Totales</small>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="display-6 fw-bold" style={{ color: '#8B4513' }}>
                      {averageRating}
                    </div>
                    <small className="text-muted">Calificación Promedio</small>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="display-6 fw-bold" style={{ color: '#8B4513' }}>
                      {reviews.filter(r => r.rating === 5).length}
                    </div>
                    <small className="text-muted">5 Estrellas</small>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="display-6 fw-bold" style={{ color: '#8B4513' }}>
                      {Math.round((reviews.filter(r => r.verified).length / reviews.length) * 100)}%
                    </div>
                    <small className="text-muted">Verificadas</small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <div className="d-grid h-100">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowModal(true)}
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
              >
                ✍️ Escribir Reseña
              </Button>
            </div>
          </Col>
        </Row>

        {/* Mensaje de Éxito */}
        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        {/* Filtros */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Filtrar por Calificación:</Form.Label>
                  <Form.Select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="all">Todas las calificaciones</option>
                    <option value="5">5 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="2">2 estrellas</option>
                    <option value="1">1 estrella</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Filtrar por Categoría:</Form.Label>
                  <Form.Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="tortas">Tortas</option>
                    <option value="postres">Postres</option>
                    <option value="reposteria">Repostería</option>
                    <option value="cheesecakes">Cheesecakes</option>
                    <option value="sin-gluten">Sin Gluten</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Lista de Reseñas */}
        <Row>
          {filteredReviews.map((review) => (
            <Col lg={6} key={review.id} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1">{review.customerName}</h6>
                      <div className="mb-1">
                        {renderStars(review.rating)}
                        {review.verified && (
                          <Badge bg="success" className="ms-2">
                            ✓ Verificada
                          </Badge>
                        )}
                      </div>
                    </div>
                    <small className="text-muted">
                      {formatDateTime(review.date)}
                    </small>
                  </div>
                  
                  <Badge 
                    bg="light" 
                    text="dark" 
                    className="mb-2"
                    style={{ backgroundColor: '#F5DEB3' }}
                  >
                    {review.productName}
                  </Badge>
                  
                  <h6 className="fw-bold mb-2" style={{ color: '#8B4513' }}>
                    {review.title}
                  </h6>
                  
                  <p className="text-muted mb-0">
                    {review.comment}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredReviews.length === 0 && (
          <div className="text-center py-5">
            <h4>No se encontraron reseñas con los filtros seleccionados</h4>
            <p className="text-muted">Intenta cambiar los filtros o sé el primero en escribir una reseña</p>
          </div>
        )}

        {/* Modal para Nueva Reseña */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton style={{ backgroundColor: '#F5DEB3' }}>
            <Modal.Title style={{ color: '#8B4513' }}>
              ✍️ Escribir Nueva Reseña
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {!isAuthenticated && (
                <Alert variant="warning" className="mb-3">
                  <small>
                    💡 <strong>Tip:</strong> Inicia sesión para que tu reseña aparezca como verificada
                  </small>
                </Alert>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Producto *</Form.Label>
                    <Form.Control
                      type="text"
                      name="productName"
                      value={newReview.productName}
                      onChange={handleInputChange}
                      placeholder="Ej: Torta de Chocolate"
                      isInvalid={!!errors.productName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.productName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      name="category"
                      value={newReview.category}
                      onChange={handleInputChange}
                    >
                      <option value="tortas">Tortas</option>
                      <option value="postres">Postres</option>
                      <option value="reposteria">Repostería</option>
                      <option value="cheesecakes">Cheesecakes</option>
                      <option value="sin-gluten">Sin Gluten</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Calificación *</Form.Label>
                <div className="fs-4">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Título de la Reseña *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newReview.title}
                  onChange={handleInputChange}
                  placeholder="Ej: ¡Excelente calidad!"
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comentario *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  placeholder="Comparte tu experiencia con este producto..."
                  isInvalid={!!errors.comment}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.comment}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Mínimo 10 caracteres. {newReview.comment.length}/500
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                variant="primary"
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
              >
                📝 Publicar Reseña
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}