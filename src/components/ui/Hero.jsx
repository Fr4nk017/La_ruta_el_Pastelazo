// Componente Hero mejorado - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';

export default function Hero({
  title = `Bienvenido a ${APP_NAME}`,
  subtitle = 'Los mejores pasteles y postres artesanales de Santiago',
  backgroundImage = '/imagenes/LaRuta.png',
  ctaText = 'Ver Catálogo',
  ctaLink = '/catalog'
}) {
  return (
    <div 
      className="hero-section position-relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="display-4 fw-bold text-white mb-4">
              {title}
            </h1>
            <p className="lead text-white mb-4 fs-5">
              {subtitle}
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                as={Link} 
                to={ctaLink}
                variant="primary" 
                size="lg"
                className="px-4 py-2"
              >
                🍰 {ctaText}
              </Button>
              <Button 
                as={Link} 
                to="/faq"
                variant="outline-light" 
                size="lg"
                className="px-4 py-2"
              >
                📞 Contactar
              </Button>
            </div>
            
            <div className="mt-5">
              <Row className="text-white">
                <Col md={4} className="mb-3">
                  <div className="h5">🚚</div>
                  <h6>Envío Gratis</h6>
                  <small>En pedidos sobre $25.000</small>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="h5">⭐</div>
                  <h6>Calidad Premium</h6>
                  <small>Ingredientes seleccionados</small>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="h5">🎂</div>
                  <h6>Personalización</h6>
                  <small>Pasteles únicos para ti</small>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string
};