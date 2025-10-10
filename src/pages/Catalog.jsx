
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';

export default function Catalog() {
  const { add } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <main className="container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 fw-bold text-center mb-3">Catálogo Completo</h1>
          <p className="lead text-center text-muted">
            Explora toda nuestra selección de postres artesanales
          </p>
        </Col>
      </Row>
      
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.id} md={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={product.img} 
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{product.name}</Card.Title>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h6 mb-0 text-primary fw-bold">
                      {formatPrice(product.price)}
                    </span>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => add(product)}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {products.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <p className="text-muted">No hay productos disponibles en este momento.</p>
          </Col>
        </Row>
      )}
    </main>
  );
}
