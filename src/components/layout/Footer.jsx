// Componente Footer - La Ruta el Pastelazo
import { Container, Row, Col } from 'react-bootstrap';
import { BUSINESS_INFO, APP_NAME } from '../../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 className="text-warning">🍰 {APP_NAME}</h5>
            <p className="text-muted small">
              Los mejores pasteles y postres artesanales de Santiago. 
              Calidad premium, sabores únicos.
            </p>
          </Col>
          
          <Col md={4} className="mb-3">
            <h6 className="text-warning">Contacto</h6>
            <ul className="list-unstyled text-muted small">
              <li>📍 {BUSINESS_INFO.address}</li>
              <li>📞 {BUSINESS_INFO.phone}</li>
              <li>✉️ {BUSINESS_INFO.email}</li>
              <li>📱 WhatsApp: {BUSINESS_INFO.whatsapp}</li>
            </ul>
          </Col>
          
          <Col md={4} className="mb-3">
            <h6 className="text-warning">Síguenos</h6>
            <div className="d-flex gap-3">
              <a 
                href={`https://instagram.com/${BUSINESS_INFO.instagram.replace('@', '')}`} 
                className="text-light text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                📷 Instagram
              </a>
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
                className="text-light text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="border-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted small">
              © {currentYear} {APP_NAME}. Todos los derechos reservados.
              <br />
              Hecho con ❤️ para los amantes de los postres.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}