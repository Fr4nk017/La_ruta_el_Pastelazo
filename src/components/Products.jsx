import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';

export default function Products() {
  const { add } = useCart();

  // Productos destacados para mostrar en la página de inicio
  const featuredProducts = [
    products.find(p => p.id === 'torta_choco_cuadrada'),
    products.find(p => p.id === 'tiramisu_clasico'),
    products.find(p => p.id === 'torta_tres_leches'),
    products.find(p => p.id === 'torta_cumpleanos'),
    products.find(p => p.id === 'cheesecake_sin_azucar'),
    products.find(p => p.id === 'torta_vegana_chocolate')
  ].filter(Boolean); // Filtrar productos que existen

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <section className="products-section py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 className="display-5 fw-bold mb-3">Nuestros Productos Destacados</h2>
            <p className="lead text-muted">
              Descubre algunos de nuestros postres más populares
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {featuredProducts.map((product) => (
            <Col key={product.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={product.img} 
                  alt={product.name}
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="text-muted mb-3">
                    {product.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0 text-primary fw-bold">
                        {formatPrice(product.price)}
                      </span>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => add(product)}
                      >
                        Agregar al Carrito
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row className="mt-5">
          <Col className="text-center">
            <Button 
              as={Link} 
              to="/catalog" 
              variant="outline-primary" 
              size="lg"
            >
              Ver Todo el Catálogo ({products.length} productos)
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}