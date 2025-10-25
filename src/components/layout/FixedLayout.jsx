// Layout principal corregido - La Ruta el Pastelazo
import PropTypes from 'prop-types';
import SimpleNavbar from './SimpleNavbar';
import Footer from './Footer';

export default function FixedLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SimpleNavbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

FixedLayout.propTypes = {
  children: PropTypes.node.isRequired
};