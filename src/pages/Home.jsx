
// Página de inicio - Pastelería 1000 Sabores
import { Container, Row, Col, Card, Button, Carousel, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';

export default function Home() {
  const { isAuthenticated } = useAuthAPI();
  const { add } = useCart();

  const featuredProducts = [
    {
      id: 'TC001',
      name: 'Torta Cuadrada de Chocolate',
      price: 15000,
      image: '/imagenes/tortas/Torta Cuadrada de Chocolate.png',
      description: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas.'
    },
    {
      id: 'TT002', 
      name: 'Torta Circular de Manjar',
      price: 12000,
      image: '/imagenes/tortas/Torta_Circular _de _Manjar.png',
      description: 'Torta tradicional chilena con manjar y nueces, un deleite clásico.'
    },
    {
      id: 'TL001',
      name: 'Torta Tres Leches', 
      price: 13000,
      image: '/imagenes/tortas/TRES-LECHES-1.webp',
      description: 'Bizcocho suave empapado en tres tipos de leche, cubierto con merengue y frutas.'
    }
  ];

  const testimonials = [
    {
      name: 'Camila R.',
      rating: 5,
      comment: 'La mejor torta de chocolate que he probado. ¡Mi familia quedó encantada!'
    },
    {
      name: 'Felipe S.',
      rating: 5,
      comment: 'Personalicé mi torta de cumpleaños y fue un éxito total. ¡Gracias por la dedicación!'
    },
    {
      name: 'Valentina M.',
      rating: 5,
      comment: 'El servicio a domicilio fue rápido y la torta llegó perfecta. ¡Repetiré sin duda!'
    }
  ];

  const handleAddToCart = (product) => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating);
  };

  return (
    <div>
      <Container className="my-5">
        {/* Carrusel destacado */}
        <section className="mb-5">
          <Carousel className="shadow rounded-4 overflow-hidden" data-bs-ride="carousel">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/imagenes/tortas/Guinnes.jpg"
                alt="Récord Guinness torta más grande del mundo"
                style={{ maxHeight: '340px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
                <h2 className="display-6 font-pacifico">¡Bienvenidos a Pastelería 1000 Sabores!</h2>
                <p>Referente en la repostería chilena desde 1975.<br />¡Récord Guinness de la torta más grande del mundo!</p>
              </Carousel.Caption>
            </Carousel.Item>
            
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/imagenes/tortas/Torta Especial de Cumpleaños.png"
                alt="Torta de cumpleaños personalizada"
                style={{ maxHeight: '340px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
                <h2 className="display-6 font-pacifico">Personaliza tu torta</h2>
                <p>Elige tamaño, relleno y mensaje especial para cada ocasión.</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/imagenes/tortas2/torta cuadrada de frutas.jpg"
                alt="Torta de frutas frescas"
                style={{ maxHeight: '340px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
                <h2 className="display-6 font-pacifico">50 años endulzando Chile</h2>
                <p>Tradición, calidad y creatividad en cada porción.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </section>

        {/* Testimonios de clientes */}
        <section className="mb-5">
          <h2 className="h4 mb-4 text-center font-pacifico">Lo que dicen nuestros clientes</h2>
          <Row className="g-4 justify-content-center">
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <p className="card-text">"{testimonial.comment}"</p>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-warning">{renderStars(testimonial.rating)}</span>
                      <span className="small text-muted">– {testimonial.name}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Misión y Visión */}
        <section className="row g-4 align-items-center mb-5">
          <Col md={6}>
            <div className="p-4 rounded-4 border bg-white h-100">
              <h3 className="h4 mb-3 font-pacifico">Nuestra Misión</h3>
              <p>
                Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-4 rounded-4 border bg-white h-100">
              <h3 className="h4 mb-3 font-pacifico">Nuestra Visión</h3>
              <p>
                Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.
              </p>
            </div>
          </Col>
        </section>

        {/* Por qué elegirnos */}
        <section className="mb-5">
          <Row className="g-4">
            <Col lg={7}>
              <h2 className="h4 mb-3 font-pacifico">¿Por qué elegirnos?</h2>
              <ul className="mb-3" style={{ color: '#5D4037' }}>
                <li>50 años de tradición y calidad en repostería chilena.</li>
                <li>Descuentos exclusivos para mayores de 50 años y estudiantes DUOC.</li>
                <li>Personaliza tu torta con mensajes y decoraciones únicas.</li>
                <li>Apoyamos la formación de nuevos talentos en gastronomía.</li>
                <li>¡Compra online y recibe en casa o retira en tienda!</li>
              </ul>
              <div className="d-flex gap-3 mt-3">
                <Button as={Link} to="/catalog" variant="primary">
                  Ver catálogo
                </Button>
                <Button as={Link} to="/profile" variant="outline-primary">
                  {isAuthenticated ? 'Mi Perfil' : 'Crear cuenta'}
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <Alert className="alert" role="note">
                <h3 className="h6 m-0">Beneficios de registro</h3>
                <ul className="mb-0 small">
                  <li>50% de descuento para mayores de 50 años.</li>
                  <li>10% de por vida con el código <strong>FELICES50</strong>.</li>
                  <li>Torta gratis de cumpleaños para estudiantes DUOC con correo institucional.</li>
                </ul>
              </Alert>
            </Col>
          </Row>
        </section>

        {/* Nuestra Historia */}
        <section className="mb-5">
          <h2 className="h4 mb-3 font-pacifico">Nuestra Historia</h2>
          <p>
            Desde 1975, Pastelería 1000 Sabores ha sido parte de los momentos más dulces de Chile. En 1995, fuimos protagonistas del récord Guinness al crear la torta más grande del mundo, un hito que marcó nuestra historia y la de la repostería nacional. Hoy, seguimos innovando y endulzando la vida de nuestros clientes, manteniendo vivas nuestras recetas tradicionales y apostando por la creatividad.
          </p>
        </section>

        {/* Tortas más vendidas */}
        <section className="mb-5">
          <h2 className="h4 mb-4 font-pacifico">Tortas más vendidas</h2>
          <Row className="row-cols-1 row-cols-md-3 g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id}>
                <Card className="h-100 text-center">
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <div className="mb-3">
                      <strong className="h5 text-primary">{formatPrice(product.price)}</strong>
                    </div>
                    <div className="d-flex gap-2 justify-content-center">
                      <Button 
                        as={Link} 
                        to={`/catalog?product=${product.id}`}
                        variant="primary" 
                        size="sm"
                      >
                        Ver detalle
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Agregar al carrito
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Impacto Comunitario */}
        <section className="mb-5">
          <h2 className="h4 mb-3 font-pacifico">Impacto Comunitario</h2>
          <p>
            Cada compra apoya la formación de estudiantes de gastronomía y el desarrollo de la comunidad local. Descubre recetas, consejos y noticias en nuestro blog.
          </p>
        </section>
      </Container>
    </div>
  );
}
