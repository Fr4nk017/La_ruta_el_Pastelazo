import { useState } from 'react';
import { Accordion, Container } from 'react-bootstrap';

export default function FAQ() {
  const [activeKey, setActiveKey] = useState('0');

  const faqs = [
    {
      id: '0',
      question: '¿Cuál es el tiempo de entrega?',
      answer: 'El tiempo de entrega varía según tu ubicación. Generalmente, entregamos en 24-48 horas en la zona urbana. Para zonas alejadas, el tiempo puede ser mayor.'
    },
    {
      id: '1',
      question: '¿Aceptan pedidos personalizados?',
      answer: 'Sí, aceptamos pedidos personalizados. Puedes contactarnos directamente para discutir los detalles de tu pastel o producto personalizado.'
    },
    {
      id: '2',
      question: '¿Cuáles son los métodos de pago?',
      answer: 'Aceptamos transferencia bancaria, efectivo, y tarjeta de crédito. Algunos métodos pueden tener opciones de pago en línea.'
    },
    {
      id: '3',
      question: '¿Tienen opciones sin gluten?',
      answer: 'Sí, contamos con opciones sin gluten. Por favor, avísanos con anticipación si necesitas productos sin gluten para poder preparar tu pedido especialmente.'
    },
    {
      id: '4',
      question: '¿Cuál es la política de cancelación?',
      answer: 'Los pedidos pueden cancelarse hasta 24 horas antes de la fecha de entrega. Si necesitas cancelar, contáctanos lo antes posible.'
    },
    {
      id: '5',
      question: '¿Pueden entregar en eventos especiales?',
      answer: 'Sí, entregamos en eventos especiales como cumpleaños, bodas, y otras celebraciones. Contáctanos para arreglar los detalles.'
    }
  ];

  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE8CC 100%)' }}>
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ color: '#8B4513', fontSize: '2.5rem' }}>
            Preguntas Frecuentes
          </h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', color: '#6D4C41' }}>
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            {faqs.map((faq) => (
              <Accordion.Item eventKey={faq.id} key={faq.id} style={{ marginBottom: '12px' }}>
                <Accordion.Header
                  style={{
                    background: 'linear-gradient(135deg, #F4E4C1 0%, #E8D4A8 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    color: '#5D4037',
                    boxShadow: '0 4px 12px rgba(212, 165, 116, 0.2)'
                  }}
                >
                  <span style={{ fontSize: '1.05rem' }}>❓ {faq.question}</span>
                </Accordion.Header>
                <Accordion.Body
                  style={{
                    background: '#FFFBF7',
                    border: '1px solid rgba(244, 228, 193, 0.5)',
                    borderRadius: '0 0 12px 12px',
                    color: '#5D4037',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}
                >
                  {faq.answer}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <div
          style={{
            marginTop: '40px',
            padding: '30px',
            background: 'linear-gradient(135deg, #D4A574 0%, #C19061 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 8px 24px rgba(193, 144, 97, 0.3)'
          }}
        >
          <h4 className="fw-bold mb-2">¿No encontraste tu respuesta?</h4>
          <p className="mb-3">Contáctanos directamente, estamos aquí para ayudarte</p>
          <a
            href="mailto:info@laruta-pastelazo.com"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 100%)',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            📧 Contáctanos
          </a>
        </div>
      </Container>
    </section>
  );
}
