import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Row, Col, Alert } from "react-bootstrap";
import { login } from '../data/fetch';
import { Link, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContextProvider";
import Todays from "./Todays";
import TodaysDep from "./TodaysDep";
import TodaysHouse from "./TodaysHouse";
import ArrivalSummary from "./ArrivalSummary";
import DepartureSummary from "./DepartureSummary";
import InHouseSummary from "./InHouseSummary";
import { useNavigate } from "react-router-dom";
import './style.css'

const Home = props => {
  let [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    console.log(searchParams.get('token'))
    if (searchParams.get('token')) {
      localStorage.setItem('token', searchParams.get('token'))
      setToken(searchParams.get('token'))// aggiorna il token nello stato del contesto
    }
  }, [])
  const { token, setToken, userInfo, setUserInfo } = useContext(UserContext)
  const navigate = useNavigate()
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [formValue, setFormValue] = useState({ email: "", password: "" })

  // const [showLogoutModal, setShowLogoutModal] = useState(false);
  // const handleShowLogoutModal = () => setShowLogoutModal(true);
  // const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.name]: event.target.value
    })
  }

  const handleLogin = async () => {
    try {
      const tokenObj = await login(formValue) //così abbiamo il token da mettere nel localstorage
      if (tokenObj && tokenObj.token) { // ctrollo se tokenObj e token sono definiti
        localStorage.setItem('token', tokenObj.token) //ls setitem accetta 2 parametri: la chiave con cui vuoi salvare e poi il valore
        setToken(tokenObj.token) //dentro token obj c'è la risposta completa dell'end point che è un oggetto e noi dobbiamo prendere solo la propiretà token
        handleClose()
        // alert('Login effettuato')
        showAlertMessage("Login effettuato con successo!", "success");
      } else {
        // alert("Credenziali errate")
        showAlertMessage("Credenziali errate. Riprovare!", "danger");
      }
    } catch (error) {
      console.log(error)
      alert(error + 'Errore, riporva più tardi')
    }
  }

  // Funzione per mostrare l'alert
  const showAlertMessage = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // const handleLogout = () =>{
  //     setToken(null)
  //     setUserInfo(null)
  //     localStorage.removeItem('token')
  //     handleCloseLogoutModal()
  //     alert('Logout effettuato')
  // }
  const handleNewReservation = () => {
    navigate("/new"); // Porta alla pagina "New" per creare una nuova prenotazione
  };

  return (
    <Container fluid>
      {/* Alert personalizzato */}
      {showAlert && (
        <Alert
          variant={alertVariant}
          className="text-center w-50 mx-auto mt-3"
          onClose={() => setShowAlert(false)}
          dismissible
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          {alertMessage}
        </Alert>
      )}
      {/* <h1 className="blog-main-title mb-3 text-center pt-5">Benvenuto sul PMS!</h1> */}
      {/* Sezione Login */}
      {!token && (
     <Container fluid className="login-section">
     
     <Row className="align-items-center justify-content-center">
       {/* Colonna di sinistra con testo */}
       <Col md={6} className="text-left p-5">
       <h2
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              color: "#1abc9c",
            }}
          >
            Ulisse PMS
          </h2>
         <h1 className="display-4">Il Miglior Software per l'Hotel Management</h1>
         <p className="lead">
         Scopri le soluzioni più affidabili per gestire le operazioni del tuo hotel in modo efficiente.
         </p>
       </Col>

       {/* Colonna di destra con il form */}
       <Col md={6} className="p-5 d-flex justify-content-center">
         <div className="login-box p-4 rounded shadow-lg" style={{ backgroundColor: "#fff", width: "100%", maxWidth: "400px" }}>
           <h2 className="mb-4">Accedi al tuo account</h2>
           <Form>
             <Form.Group className="mb-3" controlId="formEmail">
               <Form.Label>Email</Form.Label>
               <Form.Control
                 className="custom-search"
                 type="email"
                 name="email"
                 value={formValue.email}
                 onChange={handleChange}
                 placeholder="name@example.com"
                 required
               />
             </Form.Group>
             <Form.Group className="mb-3" controlId="formPassword">
               <Form.Label>Password</Form.Label>
               <Form.Control
                 className="custom-search"
                 type="password"
                 name="password"
                 value={formValue.password}
                 onChange={handleChange}
                 placeholder="your password"
                 required
               />
             </Form.Group>
             <Button
               variant="primary"
               style={{ background: "#1abc9c", border: "none" }}
               onClick={handleLogin}
               className="w-100"
             >
               Login
             </Button>
           </Form>
         </div>
       </Col>
     </Row>
   </Container>
      )}
 
      {token && (<Row className="my-4 justify-content-center">
        <Col xs={12} md={4} className="mb-4 d-flex justify-content-center">
          <ArrivalSummary className="mx-auto" />
        </Col>
        <Col xs={12} md={4} className="mb-4 d-flex justify-content-center">
          <DepartureSummary className="mx-auto" />
        </Col>
        <Col xs={12} md={4} className="mb-4 d-flex justify-content-center">
          <InHouseSummary className="mx-auto" />
        </Col>
      </Row>)}
      {token && <Todays />}
      {token && <TodaysDep />}
      {token && <TodaysHouse />}
    </Container>
  );
};

export default Home;

