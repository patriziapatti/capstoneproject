import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { UserContext } from "../context/UserContextProvider";

const Footer = () => {
  const { token } = useContext(UserContext);

  return (
    <>
      {token && (
        <footer className='mt-3' style={styles.footer}>
          <Container>
            <Row className="text-center py-4">
              {/* Colonna 1 - Informazioni */}
              <Col xs={12} md={6}>
                <h5 style={styles.footerHeading}>Informazioni</h5>
                <p style={styles.footerText}>
                  Sede Centrale: Via Roma, 123, Palermo<br />
                  Telefono: +39 123 456 789<br />
                  Email: info@example.com
                </p>
              </Col>

              {/* Colonna 2 - Collegamenti */}
              <Col xs={12} md={6}>
                <h5 style={styles.footerHeading}>Collegamenti Rapidi</h5>
                <ul style={styles.footerList}>
                  <li><a href="/" style={styles.footerLink}>Home</a></li>
                  <li><a href="/settings" style={styles.footerLink}>Impostazioni</a></li>
                </ul>
              </Col>
            </Row>
            <Row className="text-center py-3" style={styles.footerBottom}>
              <Col>
                <p style={styles.footerText}>© {new Date().getFullYear()} La Mia Applicazione. Tutti i diritti riservati.</p>
              </Col>
            </Row>
          </Container>
        </footer>
      )}
    </>
  );
};

const styles = {
  footer: {
    backgroundColor: '#34495e',
    color: '#f8f9fa',
    marginTop: 'auto',
  },
  footerHeading: {
    color: '#f8f9fa',
    marginBottom: '15px',
  },
  footerText: {
    fontSize: '14px',
  },
  footerList: {
    listStyleType: 'none',
    padding: 0,
  },
  footerLink: {
    textDecoration: 'none',
    color: '#f8f9fa',
  },
  footerBottom: {
    borderTop: '1px solid #495057',
  },
};

export default Footer;
