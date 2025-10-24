// Layout principal - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import AppNavbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />
      <main className="flex-grow-1 container-fluid px-3 px-md-4 py-4">
        <div className="row g-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};