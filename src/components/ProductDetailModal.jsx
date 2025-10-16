import PropTypes from 'prop-types';
import { Modal, Badge, ListGroup, Row, Col } from 'react-bootstrap';
import { formatPrice } from '../utils/currency';
import { productDetails, categoryInfo } from '../data/products';

/**
 * Modal para mostrar detalles completos de un producto
 */
export const ProductDetailModal = ({ product, show, onHide }) => {
  if (!product) return null;

  const details = productDetails.ingredients[product.id] || [];
  const allergens = productDetails.allergens[product.id] || [];
  const category = categoryInfo[product.category] || {};

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <img 
              src={product.img} 
              alt={product.name}
              className="img-fluid rounded shadow-sm mb-3"
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <Badge bg="primary" className="me-2">
                {category.icon} {category.name}
              </Badge>
              <h3 className="text-primary mt-2">
                {formatPrice(product.price)}
              </h3>
            </div>
            
            <p className="text-muted mb-3">
              {product.description}
            </p>

            {details.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold">🥄 Ingredientes Principales:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {details.map((ingredient, idx) => (
                    <Badge key={idx} bg="light" text="dark" className="px-3 py-2">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {allergens.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold text-warning">⚠️ Alérgenos:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {allergens.map((allergen, idx) => (
                    <Badge key={idx} bg="warning" text="dark">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3">
              <h6 className="fw-bold">📏 Tamaños Disponibles:</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                  <span>🍰 Pequeño</span>
                  <span className="text-muted">6-8 personas (20cm)</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                  <span>🎂 Mediano</span>
                  <span className="text-muted">10-12 personas (25cm)</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                  <span>🎉 Grande</span>
                  <span className="text-muted">15-20 personas (30cm)</span>
                </ListGroup.Item>
              </ListGroup>
            </div>

            <div className="alert alert-info mb-0">
              <small>
                <strong>📦 Pedidos:</strong> Realizamos entregas de lunes a sábado.
                Los pedidos especiales requieren 48 horas de anticipación.
              </small>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Cerrar
        </button>
        <button className="btn btn-primary">
          Agregar al Carrito
        </button>
      </Modal.Footer>
    </Modal>
  );
};

ProductDetailModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string
  }),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default ProductDetailModal;
