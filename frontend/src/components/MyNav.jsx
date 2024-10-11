import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Image, Modal } from 'react-bootstrap';
import MyImage from '../assets/hotel.jpg'
import { UserContext } from "../context/UserContextProvider";
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyNav.css'

function MyNav() {
  const { token, setToken, userInfo, setUserInfo } = useContext(UserContext)
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleLogout = () => {
    setToken(null)
    setUserInfo(null)
    localStorage.removeItem('token')
    handleCloseLogoutModal()
    // alert('Logout effettuato')
    navigate('/')
  }

  const handleNewReservation = () => {
    navigate("/new"); // Porta alla pagina "New" per creare una nuova prenotazione
  };


  return (<>
    {token && <Navbar expand="lg" className="custom-navbar pt-4 pb-4">
      <Container>
        <Navbar.Brand as={Link} to={'/'}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 'bold', color: '#1abc9c' }}>
            Ulisse PMS
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggle" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={'/'} className="nav-link-custom">Home</Nav.Link>
            <Nav.Link as={Link} to={'/bookings'} className="nav-link-custom">Prenotazioni</Nav.Link>
            <Nav.Link as={Link} to={'/guests'} className="nav-link-custom">Ospiti </Nav.Link>
            <Nav.Link as={Link} to={'/settings'} className="nav-link-custom">Impostazioni</Nav.Link>
          </Nav>

          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link as={Link} to={'/profile'} className="user-greeting">
              {userInfo && userInfo.name ? `Ciao, ${userInfo.name}` : ""}
            </Nav.Link>
            <Button variant="outline-secondary" style={{color: 'white'}} className="mx-2 custom-btn custom-btn-prof" onClick={handleNewReservation}>
              Nuova Prenotazione
            </Button>

            <Button className="ms-2 custom-btn custom-btn-dark" variant="dark" onClick={handleShowLogoutModal}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* Modale di Logout */}
      <Modal show={showLogoutModal} onHide={handleCloseLogoutModal} >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler effettuare il logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutModal}>
            Annulla
          </Button>
          <Button className="btn-bg-color" onClick={handleLogout}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>

    </Navbar>}
  </>
  );
}

export default MyNav;