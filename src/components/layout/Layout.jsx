// Layout principal - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import AppNavbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};