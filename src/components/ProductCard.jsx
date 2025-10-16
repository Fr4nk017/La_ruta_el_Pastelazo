import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { formatPrice } from '../utils/currency';
import { IMAGE_CONFIG } from '../config/performance';
import { categoryInfo } from '../data/products';
import ProductDetailModal from './ProductDetailModal';

/**
 * Componente reutilizable para mostrar una tarjeta de producto
 * Memoizado para evitar re-renders innecesarios
 */
export const ProductCard = memo(({ 
  product, 
  onAddToCart, 
  imageHeight = '200px',
  showDescription = true,
  buttonText = 'Agregar',
  showCategory = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const category = categoryInfo[product.category] || {};

  return (
    <>
      <Card className="h-100 shadow-sm product-card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
        <div 
          onClick={() => setShowModal(true)}
          style={{ position: 'relative' }}
        >
          {showCategory && category.icon && (
            <Badge 
              bg="primary" 
              className="position-absolute top-0 start-0 m-2"
              style={{ zIndex: 1 }}
            >
              {category.icon}
            </Badge>
          )}
          <Card.Img 
            variant="top" 
            src={product.img} 
            alt={product.name}
            style={{ height: imageHeight, objectFit: 'cover' }}
            loading={IMAGE_CONFIG.defaultLoading}
            decoding="async"
          />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title 
            className="h6" 
            onClick={() => setShowModal(true)}
            style={{ cursor: 'pointer' }}
          >
            {product.name}
          </Card.Title>
          {showDescription && product.description && (
            <Card.Text 
              className="small text-muted mb-2"
              onClick={() => setShowModal(true)}
            >
              {product.description}
            </Card.Text>
          )}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <span className="h6 mb-0 text-primary fw-bold">
                {formatPrice(product.price)}
              </span>
              <div className="d-flex gap-1">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowModal(true)}
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  Ver más
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  aria-label={`Agregar ${product.name} al carrito`}
                >
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ProductDetailModal 
        product={product}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </>
  );
});

ProductCard.displayName = 'ProductCard';

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  imageHeight: PropTypes.string,
  showDescription: PropTypes.bool,
  buttonText: PropTypes.string,
  showCategory: PropTypes.bool
};

export default ProductCard;
