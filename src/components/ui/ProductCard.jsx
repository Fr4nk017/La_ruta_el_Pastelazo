// Componente ProductCard mejorado - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import { memo, useState, useCallback, useMemo } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { formatPrice, getImageUrl, handleImageError } from '../../utils';
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

  const handleImageErrorLocal = (e) => {
    handleImageError(e);
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
        className={`h-100 shadow-sm product-card transition-all ${className}`}
        style={{ borderRadius: '1rem' }}
      >
        <div 
          onClick={() => setShowModal(true)}
          className="position-relative overflow-hidden"
        >
          {/* Badges flotantes */}
          {productBadges.map((badge, index) => (
            <Badge 
              key={index}
              bg={badge.variant}
              className="position-absolute m-2 py-2 px-3"
              style={{ 
                top: index * 40,
                left: 0,
                zIndex: 2,
                fontSize: '0.75rem',
                fontWeight: '600'
              }}
            >
              {badge.text}
            </Badge>
          ))}
          
          {/* Placeholder de carga */}
          {!imageLoaded && (
            <div 
              className="d-flex align-items-center justify-content-center bg-light loading-skeleton"
              style={{ 
                height: {
                  xs: '150px',
                  sm: '180px',
                  md: imageHeight
                }[window.innerWidth < 576 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'],
                borderRadius: '1rem 1rem 0 0'
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}
          
          {/* Imagen del producto */}
          <Card.Img 
            variant="top" 
            src={getImageUrl(product.img)} 
            alt={product.name}
            className="img-fluid transition-transform"
            style={{ 
              height: {
                xs: '150px',
                sm: '180px',
                md: imageHeight
              }[window.innerWidth < 576 ? 'xs' : window.innerWidth < 768 ? 'sm' : 'md'],
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
              borderRadius: '1rem 1rem 0 0'
            }}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageErrorLocal}
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