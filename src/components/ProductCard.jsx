import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { formatPrice } from '../utils/currency';

/**
 * Componente reutilizable para mostrar una tarjeta de producto
 */
export const ProductCard = ({ 
  product, 
  onAddToCart, 
  imageHeight = '200px',
  showDescription = true,
  buttonText = 'Agregar'
}) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={product.img} 
        alt={product.name}
        style={{ height: imageHeight, objectFit: 'cover' }}
        loading="lazy"
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{product.name}</Card.Title>
        {showDescription && product.description && (
          <Card.Text className="small text-muted mb-2">
            {product.description}
          </Card.Text>
        )}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <span className="h6 mb-0 text-primary fw-bold">
              {formatPrice(product.price)}
            </span>
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
      </Card.Body>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  imageHeight: PropTypes.string,
  showDescription: PropTypes.bool,
  buttonText: PropTypes.string
};

export default ProductCard;
