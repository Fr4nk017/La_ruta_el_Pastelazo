import { useState } from 'react'

function Reviews() {
  const [reviews] = useState([
    {
      id: 1,
      name: 'María González',
      rating: 5,
      comment: 'Excelente calidad y sabor. La torta de chocolate estaba deliciosa.',
      date: '2024-10-05',
      product: 'Torta de Chocolate'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      rating: 5,
      comment: 'Siempre compramos aquí para cumpleaños familiares. Nunca fallan.',
      date: '2024-10-03',
      product: 'Torta Especial de Cumpleaños'
    },
    {
      id: 3,
      name: 'Ana López',
      rating: 4,
      comment: 'Muy buena atención y productos frescos. Recomendado.',
      date: '2024-10-01',
      product: 'Mousse de Chocolate'
    }
  ])

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    product: ''
  })

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('¡Gracias por tu reseña! Será publicada después de revisión.')
    setNewReview({ name: '', rating: 5, comment: '', product: '' })
  }

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
        Reseñas de nuestros clientes
      </h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="mb-4">
            <h4>Lo que dicen nuestros clientes</h4>
            <div className="row">
              {reviews.map((review) => (
                <div key={review.id} className="col-md-6 mb-3">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>{review.name}</strong>
                        <span className="text-warning">{renderStars(review.rating)}</span>
                      </div>
                      <p className="card-text">{review.comment}</p>
                      <small className="text-muted">
                        {review.product} - {review.date}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Deja tu reseña</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Tu nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name"
                    name="name"
                    value={newReview.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="product" className="form-label">Producto</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="product"
                    name="product"
                    value={newReview.product}
                    onChange={handleChange}
                    placeholder="¿Qué producto probaste?"
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Calificación</label>
                  <select 
                    className="form-select" 
                    id="rating"
                    name="rating"
                    value={newReview.rating}
                    onChange={handleChange}
                  >
                    <option value={5}>★★★★★ (5 estrellas)</option>
                    <option value={4}>★★★★☆ (4 estrellas)</option>
                    <option value={3}>★★★☆☆ (3 estrellas)</option>
                    <option value={2}>★★☆☆☆ (2 estrellas)</option>
                    <option value={1}>★☆☆☆☆ (1 estrella)</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Tu comentario</label>
                  <textarea 
                    className="form-control" 
                    id="comment"
                    name="comment"
                    rows="4"
                    value={newReview.comment}
                    onChange={handleChange}
                    placeholder="Cuéntanos tu experiencia..."
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Enviar reseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews