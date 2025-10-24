// Componente Footer - La Ruta el Pastelazo
import { Container, Row, Col } from 'react-bootstrap';
import { BUSINESS_INFO, APP_NAME } from '../../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer py-4 mt-5">
      <Container fluid="xxl" className="px-3">
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          <Col>
            <h5 className="gradient-text mb-3">🍰 {APP_NAME}</h5>
            <p className="text-muted small mb-4">
              Los mejores pasteles y postres artesanales de Santiago. 
              Calidad premium, sabores únicos.
            </p>
          </Col>
          
          <Col>
            <h6 className="text-warning mb-3">Contacto</h6>
            <ul className="list-unstyled text-muted small mb-0">
              <li className="mb-2">
                <span className="me-2">📍</span>
                {BUSINESS_INFO.address}
              </li>
              <li className="mb-2">
                <span className="me-2">📞</span>
                {BUSINESS_INFO.phone}
              </li>
              <li className="mb-2">
                <span className="me-2">✉️</span>
                {BUSINESS_INFO.email}
              </li>
              <li>
                <span className="me-2">📱</span>
                WhatsApp: {BUSINESS_INFO.whatsapp}
              </li>
            </ul>
          </Col>
          
          <Col>
            <h6 className="text-warning mb-3">Horario</h6>
            <ul className="list-unstyled text-muted small mb-0">
              <li className="mb-2">Lunes a Viernes: 9:00 - 19:00</li>
              <li className="mb-2">Sábados: 10:00 - 18:00</li>
              <li>Domingos: 10:00 - 14:00</li>
            </ul>
          </Col>
          
          <Col>
            <h6 className="text-warning mb-3">Síguenos</h6>
            <div className="d-flex flex-column gap-2">
              <a 
                href={`https://instagram.com/${BUSINESS_INFO.instagram.replace('@', '')}`} 
                className="text-muted text-decoration-none transition-all d-inline-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Síguenos en Instagram"
              >
                <span className="me-2">📷</span>
                Instagram
              </a>
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}`} 
                className="text-muted text-decoration-none transition-all d-inline-flex align-items-center"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contáctanos por WhatsApp"
              >
                <span className="me-2">💬</span>
                WhatsApp
              </a>
              <a 
                href={`mailto:${BUSINESS_INFO.email}`}
                className="text-muted text-decoration-none transition-all d-inline-flex align-items-center"
                aria-label="Envíanos un correo"
              >
                <span className="me-2">✉️</span>
                Email
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="border-secondary my-4" />
        
        <div className="text-center">
          <p className="mb-0 text-muted small">
            © {currentYear} {APP_NAME}. Todos los derechos reservados.
            <span className="d-none d-sm-inline mx-2">|</span>
            <br className="d-sm-none" />
            Hecho con <span role="img" aria-label="amor">❤️</span> para los amantes de los postres.
          </p>
        </div>
      </Container>
    </footer>
  );
}