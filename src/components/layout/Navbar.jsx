
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export default function AppNavbar(){
  const { summary } = useCart();
  return (
    <Navbar bg="light" expand="lg" className="border-bottom mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">🍰 Mil Sabores</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav"/>
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/catalog">Catálogo</Nav.Link>
            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
            <Nav.Link as={Link} to="/cart">Carrito ({summary.count})</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
