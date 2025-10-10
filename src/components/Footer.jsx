import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-5 border-top">
      <Container className="p-4">
        <Row>
          <Col lg={6} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">🍰 La Ruta el Pastelazo</h5>
            <p>
              Los mejores postres artesanales hechos con amor y los ingredientes más frescos.
              Endulzamos tus momentos especiales.
            </p>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h6 className="text-uppercase">Enlaces</h6>
            <ul className="list-unstyled mb-0">
              <li><a href="/" className="text-dark">Inicio</a></li>
              <li><a href="/catalog" className="text-dark">Catálogo</a></li>
              <li><a href="/faq" className="text-dark">FAQ</a></li>
              <li><a href="/tracking" className="text-dark">Seguimiento</a></li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h6 className="text-uppercase">Contacto</h6>
            <ul className="list-unstyled mb-0">
              <li>📱 WhatsApp: +56 9 XXXX XXXX</li>
              <li>📧 info@larutaelpastelazo.cl</li>
              <li>📍 Santiago, Chile</li>
            </ul>
          </Col>
        </Row>
      </Container>
      
      <div className="text-center p-3 bg-dark text-white">
        © 2025 La Ruta el Pastelazo. Todos los derechos reservados.
      </div>
    </footer>
  );
}