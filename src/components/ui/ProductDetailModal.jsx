import PropTypes from 'prop-types';
import { memo, useCallback, useMemo } from 'react';
import { Modal, Badge, ListGroup, Row, Col, Button, Alert } from 'react-bootstrap';
import { formatPrice } from '../../utils';
import { productDetails, categoryInfo } from '../../data/products';
import { PRODUCT_SIZES } from '../../constants/products';

const getSizeIcon = (key) => {
  switch (key) {
    case 'PERSONAL': return '🧁';
    case 'MEDIANA': return '🍰';
    default: return '🎂';
  }
};

const getSizeServings = (key) => {
  switch (key) {
    case 'PERSONAL': return '2-4 personas';
    case 'MEDIANA': return '6-8 personas';
    default: return '12-15 personas';
  }
};

/**
 * Modal para mostrar detalles completos de un producto y sus opciones de compra
 * @component
 */
const ProductDetailModal = memo(({ product, show, onHide, onAddToCart }) => {
  // Memoized values
  const productInfo = useMemo(() => {
    if (!product) return null;

    const detail = productDetails[product?.id] || {};
    const category = categoryInfo[product?.category] || {};
    
    return {
      details: detail.ingredients || [],
      allergens: detail.allergens || [],
      nutrition: detail.nutrition || {},
      category,
      sizes: Object.entries(PRODUCT_SIZES)
        .slice(1, 4)
        .map(([key, size]) => ({
          key,
          ...size,
          icon: getSizeIcon(key),
          servings: getSizeServings(key),
          price: (product?.price || 0) * size.multiplier
        }))
    };
  }, [product]);

  // Handlers
  const handleAddToCart = useCallback(() => {
    if (product && onAddToCart) {
      onAddToCart(product);
      onHide();
    }
  }, [product, onAddToCart, onHide]);

  const handleShare = useCallback(() => {
    if (!product || !navigator.share) return;

    navigator.share({
      title: product.name,
      text: product.description,
      url: globalThis.location.href
    }).catch(console.error);
  }, [product]);

  // Early return if no product or product info
  if (!product || !productInfo) return null;

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="product-detail-modal"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title as="h4" className="fw-bold text-primary">
          {product.name}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Row className="g-4">
          {/* Imagen del producto */}
          <Col md={6}>
            <div className="position-relative rounded-4 overflow-hidden shadow-sm">
              <img 
                src={product.img} 
                alt={product.name}
                className="img-fluid w-100 h-100 object-fit-cover"
                style={{ minHeight: '300px', maxHeight: '400px' }}
                loading="lazy"
              />
              {productInfo.category.icon && (
                <Badge 
                  bg="primary" 
                  className="position-absolute top-0 start-0 m-3 px-3 py-2"
                >
                  {productInfo.category.icon} {productInfo.category.name}
                </Badge>
              )}
            </div>
          </Col>
          
          {/* Información del producto */}
          <Col md={6}>
            <div className="d-flex flex-column h-100">
              {/* Precio y descripción */}
              <div className="mb-4">
                <div className="bg-light rounded-3 p-3 mb-3">
                  <h3 className="text-primary fw-bold mb-1">
                    {formatPrice(product.price)}
                  </h3>
                  <small className="text-muted">
                    Precio base (tamaño mediano)
                  </small>
                </div>
                
                {product.description && (
                  <p className="lead mb-0 lh-base">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Ingredientes */}
              {productInfo.details.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">🥄 Ingredientes Principales:</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {productInfo.details.map((ingredient) => (
                      <Badge 
                        key={`ingredient-${ingredient.toLowerCase().replaceAll(/\s+/g, '-')}`}
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Alérgenos */}
              {productInfo.allergens.length > 0 && (
                <Alert variant="warning" className="py-2 mb-4">
                  <small className="d-flex align-items-center gap-2">
                    <span className="fw-bold">⚠️ Contiene alérgenos:</span>
                    {productInfo.allergens.join(', ')}
                  </small>
                </Alert>
              )}

              {/* Tamaños disponibles */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">📏 Tamaños Disponibles:</h6>
                <ListGroup variant="flush" className="border rounded-3">
                  {productInfo.sizes.map(size => (
                    <ListGroup.Item 
                      key={size.key}
                      className="d-flex justify-content-between align-items-center py-3 border-0"
                    >
                      <span>
                        {size.icon} {size.name}
                      </span>
                      <div className="text-end">
                        <div className="fw-bold text-primary">
                          {formatPrice(size.price)}
                        </div>
                        <small className="text-muted">
                          {size.servings}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              {/* Información de entrega */}
              <Alert variant="info" className="mb-4">
                <h6 className="fw-bold mb-2">📦 Información de entrega:</h6>
                <ul className="list-unstyled mb-0">
                  <li>• Entregas de lunes a sábado</li>
                  <li>• Pedidos especiales: 48h de anticipación</li>
                  <li>• Envío gratis en pedidos sobre $25.000</li>
                </ul>
              </Alert>

              {/* Botones de acción */}
              <div className="mt-auto">
                <Row className="g-2">
                  <Col xs={12}>
                    <Button 
                      variant="primary" 
                      onClick={handleAddToCart}
                      className="w-100 fw-semibold py-2"
                      size="lg"
                    >
                      🛒 Agregar al Carrito - {formatPrice(product.price)}
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button 
                      variant="outline-primary" 
                      onClick={handleShare}
                      className="w-100"
                    >
                      📤 Compartir
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button 
                      variant="outline-secondary"
                      onClick={onHide}
                      className="w-100"
                    >
                      Cerrar
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
});

ProductDetailModal.propTypes = {
  /** Objeto con la información del producto */
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string
  }),
  /** Estado de visibilidad del modal */
  show: PropTypes.bool.isRequired,
  /** Función para cerrar el modal */
  onHide: PropTypes.func.isRequired,
  /** Función para agregar producto al carrito */
  onAddToCart: PropTypes.func.isRequired
};

ProductDetailModal.displayName = 'ProductDetailModal';

export default ProductDetailModal;