import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';

export default function Products() {
  const { add } = useCart();

  const featuredProducts = products.slice(0, 3); // Mostrar solo los primeros 3 productos

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
                    Deliciosa torta artesanal hecha con los mejores ingredientes.
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
              Ver Todo el Catálogo
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}