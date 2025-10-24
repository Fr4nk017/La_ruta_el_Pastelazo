// Componente de productos destacados - La Ruta el Pastelazo
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from './ui';

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

  return (
    <section className="products-section py-5">
      <Container>
        <Row className="mb-4">
          <Col className="text-center">
            <h2 className="display-5 fw-bold mb-3">Nuestros Productos Destacados</h2>
            <p className="lead text-muted">
              Descubre algunos de nuestros postres más populares, preparados con amor y los mejores ingredientes
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {featuredProducts.map((product) => (
            <Col key={product.id} md={6} lg={4}>
              <ProductCard 
                product={product}
                onAddToCart={add}
                showCategory
                imageHeight="250px"
              />
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
              className="px-5 py-3"
            >
              🍰 Ver Todo el Catálogo ({products.length} productos)
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}