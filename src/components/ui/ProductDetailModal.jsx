// Modal de detalles de producto mejorado - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import { Modal, Badge, ListGroup, Row, Col, Button, Alert } from 'react-bootstrap';
import { formatPrice } from '../../utils';
import { productDetails, categoryInfo } from '../../data/products';
import { PRODUCT_SIZES } from '../../constants/products';

/**
 * Modal para mostrar detalles completos de un producto
 */
export const ProductDetailModal = ({ product, show, onHide, onAddToCart }) => {
  if (!product) return null;

  const productDetail = productDetails[product.id] || {};
  const details = productDetail.ingredients || [];
  const allergens = productDetail.allergens || [];
  const nutrition = productDetail.nutrition || {};
  const category = categoryInfo[product.category] || {};

  const handleAddToCart = () => {
    onAddToCart(product);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="h4">{product.name}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Row className="g-4">
          <Col md={6}>
            <img 
              src={product.img} 
              alt={product.name}
              className="img-fluid rounded shadow-sm"
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />
          </Col>
          
          <Col md={6}>
            <div className="mb-3">
              {category.icon && (
                <Badge bg="primary" className="mb-2 px-3 py-2">
                  {category.icon} {category.name}
                </Badge>
              )}
              <h3 className="text-primary fw-bold mb-1">
                {formatPrice(product.price)}
              </h3>
              <small className="text-muted">Precio base (tamaño mediano)</small>
            </div>
            
            {product.description && (
              <p className="text-dark mb-3 lh-base">
                {product.description}
              </p>
            )}

            {details.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold mb-2">🥄 Ingredientes Principales:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {details.map((ingredient, idx) => (
                    <Badge key={idx} bg="light" text="dark" className="px-2 py-1">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {allergens.length > 0 && (
              <Alert variant="warning" className="py-2 mb-3">
                <small>
                  <strong>⚠️ Contiene alérgenos:</strong> {allergens.join(', ')}
                </small>
              </Alert>
            )}

            <div className="mb-3">
              <h6 className="fw-bold mb-2">📏 Tamaños Disponibles:</h6>
              <ListGroup variant="flush" className="border rounded">
                {Object.entries(PRODUCT_SIZES).slice(1, 4).map(([key, size]) => (
                  <ListGroup.Item 
                    key={key}
                    className="d-flex justify-content-between align-items-center py-2 border-0"
                  >
                    <span>
                      {key === 'PERSONAL' ? '🧁' : key === 'MEDIANA' ? '🍰' : '🎂'} 
                      {size.name}
                    </span>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {formatPrice(product.price * size.multiplier)}
                      </div>
                      <small className="text-muted">
                        {key === 'PERSONAL' ? '2-4 personas' : 
                         key === 'MEDIANA' ? '6-8 personas' : '12-15 personas'}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <Alert variant="info" className="mb-0">
              <small>
                <strong>📦 Información de entrega:</strong>
                <br />
                • Entregas de lunes a sábado
                <br />
                • Pedidos especiales: 48h de anticipación
                <br />
                • Envío gratis en pedidos sobre $25.000
              </small>
            </Alert>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleAddToCart}
          className="px-4"
        >
          🛒 Agregar al Carrito
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ProductDetailModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string
  }),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ProductDetailModal;