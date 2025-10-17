// Página de prueba para diagnosticar problemas del catálogo
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { products, categories } from '../data/products';
import { getImageUrl, handleImageError } from '../utils';

export default function CatalogTest() {
  console.log('Products:', products);
  console.log('Categories:', categories);

  if (!products || !Array.isArray(products)) {
    return (
      <Container className="py-4">
        <h2>Error: No se pudieron cargar los productos</h2>
        <p>Products: {JSON.stringify(products)}</p>
      </Container>
    );
  }

  if (!categories) {
    return (
      <Container className="py-4">
        <h2>Error: No se pudieron cargar las categorías</h2>
        <p>Categories: {JSON.stringify(categories)}</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1>Catálogo de Prueba</h1>
      <p>Productos encontrados: {products.length}</p>
      <p>Categorías encontradas: {Object.keys(categories).length}</p>
      
      <Row>
        {products.slice(0, 3).map((product) => (
          <Col key={product.id} md={4} className="mb-3">
            <Card>
              <Card.Img 
                variant="top" 
                src={getImageUrl(product.img)} 
                style={{ height: '200px', objectFit: 'cover' }}
                onError={handleImageError}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <p><strong>${product.price.toLocaleString()}</strong></p>
                <Button variant="primary">Agregar al carrito</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}