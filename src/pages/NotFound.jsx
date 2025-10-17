import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center shadow border-0">
              <Card.Body className="p-5">
                <div className="display-1 mb-4">🍰</div>
                <h1 className="display-4 fw-bold mb-3" style={{ color: '#8B4513' }}>
                  404
                </h1>
                <h2 className="h4 mb-3">¡Ups! Página no encontrada</h2>
                <p className="text-muted mb-4">
                  La página que buscas no existe o ha sido movida.
                </p>
                
                {/* Debug info */}
                <div className="bg-light p-3 rounded mb-4 text-start">
                  <h6 className="fw-bold mb-2">🔍 Información de debug:</h6>
                  <small className="text-muted">
                    <strong>Ruta solicitada:</strong> {location.pathname}<br/>
                    <strong>Búsqueda:</strong> {location.search}<br/>
                    <strong>Hash:</strong> {location.hash}<br/>
                    <strong>Timestamp:</strong> {new Date().toLocaleString()}
                  </small>
                </div>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(ROUTES.HOME)}
                    style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                  >
                    🏠 Ir al inicio
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate(ROUTES.CATALOG)}
                  >
                    🍰 Ver catálogo
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    ← Volver atrás
                  </Button>
                </div>

                <hr className="my-4" />
                
                <div className="text-muted">
                  <h6 className="fw-bold mb-2">📍 Páginas disponibles:</h6>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(ROUTES.HOME)}
                    >
                      Inicio
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(ROUTES.CATALOG)}
                    >
                      Catálogo
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(ROUTES.CART)}
                    >
                      Carrito
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate(ROUTES.FAQ)}
                    >
                      FAQ
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}