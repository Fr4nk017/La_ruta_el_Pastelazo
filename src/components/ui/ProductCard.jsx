// Componente ProductCard mejorado - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { formatPrice } from '../../utils';
import { categoryInfo } from '../../data/products';
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
  buttonText = 'Agregar al carrito',
  className = '',
  badges = []
}) => {
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    e.target.src = '/imagenes/placeholder.jpg';
  };

  // Determinar badges automáticamente si no se proporcionan
  const getBadges = () => {
    if (badges.length > 0) return badges;
    
    const autoBadges = [];
    
    // Badge "Más vendido" para productos específicos
    if (['torta_choco_cuadrada', 'tiramisu_clasico', 'torta_cumpleanos'].includes(product.id)) {
      autoBadges.push({ text: 'Más vendido', variant: 'warning' });
    }
    
    // Badge "Nuevo" para productos recientes
    if (['mousse_chocolate', 'torta_vegana_chocolate', 'cheesecake_sin_azucar'].includes(product.id)) {
      autoBadges.push({ text: 'Nuevo', variant: 'success' });
    }
    
    return autoBadges;
  };

  const productBadges = getBadges();

  return (
    <>
      <Card 
        className={`h-100 shadow-sm product-card ${className}`} 
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.3s ease',
          border: 'none',
          borderRadius: '12px'
        }}
      >
        <div 
          onClick={() => setShowModal(true)}
          style={{ position: 'relative' }}
        >
          {/* Badges en la esquina superior */}
          {productBadges.map((badge, index) => (
            <Badge 
              key={index}
              bg={badge.variant}
              className="position-absolute"
              style={{ 
                top: '10px', 
                left: index === 0 ? '10px' : '10px',
                marginTop: index * 30,
                zIndex: 1,
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {badge.text}
            </Badge>
          ))}
          
          {!imageLoaded && (
            <div 
              className="d-flex align-items-center justify-content-center bg-light"
              style={{ height: imageHeight, borderRadius: '12px 12px 0 0' }}
            >
              <div className="text-muted">Cargando...</div>
            </div>
          )}
          
          <Card.Img 
            variant="top" 
            src={product.img} 
            alt={product.name}
            style={{ 
              height: imageHeight, 
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
              borderRadius: '12px 12px 0 0'
            }}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
        
        <Card.Body className="d-flex flex-column p-3">
          <Card.Title 
            className="h6 mb-2" 
            onClick={() => setShowModal(true)}
            style={{ 
              cursor: 'pointer',
              color: '#8B4513',
              fontWeight: 'bold',
              lineHeight: '1.3'
            }}
            title={product.name}
          >
            {product.name}
          </Card.Title>
          
          {showDescription && product.description && (
            <Card.Text 
              className="text-muted mb-3"
              onClick={() => setShowModal(true)}
              style={{ 
                fontSize: '0.9rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.4'
              }}
            >
              {product.description}
            </Card.Text>
          )}
          
          <div className="mt-auto">
            <div className="mb-3">
              <span 
                className="h5 mb-0 fw-bold"
                style={{ color: '#8B4513' }}
              >
                {formatPrice(product.price)}
              </span>
            </div>
            
            <div className="d-grid gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowModal(true)}
                style={{ 
                  color: '#8B4513', 
                  borderColor: '#8B4513',
                  borderRadius: '8px'
                }}
                className="mb-1"
              >
                Ver detalle
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                style={{ 
                  backgroundColor: '#CD853F', 
                  borderColor: '#CD853F',
                  borderRadius: '8px'
                }}
                aria-label={`Agregar ${product.name} al carrito`}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ProductDetailModal 
        product={product}
        show={showModal}
        onHide={() => setShowModal(false)}
        onAddToCart={onAddToCart}
      />
    </>
  );
});

ProductCard.displayName = 'ProductCard';

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    ingredients: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  imageHeight: PropTypes.string,
  showDescription: PropTypes.bool,
  buttonText: PropTypes.string,
  showCategory: PropTypes.bool,
  className: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired
  }))
};

export default ProductCard;