import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Button, Image, Modal } from 'react-bootstrap';
import MyImage from '../assets/hotel.jpg'
import { UserContext } from "../context/UserContextProvider";
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MyNav() {
  const {token, setToken, userInfo, setUserInfo} = useContext(UserContext)
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false);
    const handleShowLogoutModal = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);
    const handleLogout = () =>{
      setToken(null)
      setUserInfo(null)
      localStorage.removeItem('token')
      handleCloseLogoutModal()
      alert('Logout effettuato')
      navigate('/')
  }
  return (<>
    {token && <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
      <Image src={MyImage} width="70" height="50"/>
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={'/'}>Home</Nav.Link>
            <Nav.Link as={Link} to={'/bookings'}>Prenotazioni</Nav.Link>
            <Nav.Link as={Link} to={'/guests'}>Ospiti </Nav.Link>
            <Nav.Link as={Link} to={'/settings'}>Impostazioni</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
                <Nav.Link as={Link} to={'/profile'}>
                  {userInfo && userInfo.name ? `Ciao, ${userInfo.name}` : ""}
                </Nav.Link>
                <Button className="ms-2 me-2" variant="dark" onClick={handleShowLogoutModal}>
            Logout
          </Button>
          <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
            <Modal.Header closeButton>
              <Modal.Title>Conferma Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>Sei sicuro di voler effettuare il logout?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseLogoutModal}>
                Annulla
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                Conferma Logout
              </Button>
            </Modal.Footer>
        </Modal>
              </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>}
    </>
  );
}

export default MyNav;