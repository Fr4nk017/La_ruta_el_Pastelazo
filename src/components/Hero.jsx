import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero-section bg-light py-5 rounded mb-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <h1 className="display-4 fw-bold text-primary mb-3">
              🍰 La Ruta el Pastelazo
            </h1>
            <p className="lead mb-4">
              Descubre los sabores más exquisitos en nuestras tortas artesanales.
              Cada bocado es una experiencia única hecha con amor y los mejores ingredientes.
            </p>
            <div className="d-grid gap-2 d-md-flex">
              <Button 
                as={Link} 
                to="/catalog" 
                variant="primary" 
                size="lg" 
                className="me-md-2"
              >
                Ver Catálogo
              </Button>
              <Button 
                as={Link} 
                to="/faq" 
                variant="outline-primary" 
                size="lg"
              >
                Más Info
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <img 
              src="/imagenes/Logo la ruta el pastelazo.png" 
              alt="La Ruta el Pastelazo" 
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px' }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}