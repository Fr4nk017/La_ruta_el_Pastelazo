function Footer() {
  return (
    <footer className="py-4 mt-5 border-top">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 style={{ fontFamily: "'Pacifico', cursive", color: '#8B4513' }}>
              Pastelería 1000 Sabores
            </h5>
            <p className="text-muted">
              50 años endulzando Chile con tradición, calidad y creatividad.
            </p>
          </div>
          <div className="col-md-3">
            <h6>Enlaces útiles</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Sobre nosotros</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Contacto</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Términos y condiciones</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Síguenos</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Facebook</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Instagram</a></li>
              <li><a href="#" className="text-muted text-decoration-none">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center text-muted">
          <p>&copy; 2024 Pastelería 1000 Sabores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer