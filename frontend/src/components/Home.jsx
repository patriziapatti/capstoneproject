import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
// import BlogList from "../../components/blog/blog-list/BlogList";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Row, Col } from "react-bootstrap";
import { login } from '../data/fetch';
import { Link, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContextProvider";
import Todays from "./Todays";
import TodaysDep from "./TodaysDep";
import TodaysHouse from "./TodaysHouse";
import ArrivalSummary from "./ArrivalSummary";
import DepartureSummary from "./DepartureSummary";
import InHouseSummary from "./InHouseSummary";


const Home = props => {
    let [searchParams, setSearchParams]=useSearchParams()
    useEffect(()=>{
      console.log(searchParams.get('token'))
      if(searchParams.get('token')){
        localStorage.setItem('token',searchParams.get('token'))
        setToken(searchParams.get('token'))// aggiorna il token nello stato del contesto
      }
    },[])
    const {token, setToken, userInfo, setUserInfo} = useContext(UserContext)
    // console.log(authorInfo._id)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [formValue, setFormValue] = useState({email:"", password:""})
    
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const handleShowLogoutModal = () => setShowLogoutModal(true);
    const handleCloseLogoutModal = () => setShowLogoutModal(false);
    
    const handleChange = (event) =>{
      setFormValue({
        ...formValue, 
        [event.target.name] : event.target.value
      })
    }
  
    const handleLogin = async () => {
      try {
        const tokenObj = await login(formValue) //così abbiamo il token da mettere nel localstorage
        if(tokenObj && tokenObj.token){ // ctrollo se tokenObj e token sono definiti
        localStorage.setItem('token', tokenObj.token) //ls setitem accetta 2 parametri: la chiave con cui vuoi salvare e poi il valore
        setToken(tokenObj.token) //dentro token obj c'è la risposta completa dell'end point che è un oggetto e noi dobbiamo prendere solo la propiretà token
        handleClose()
        alert('Login effettuato')
        }else {
        alert("Credenziali errate")
        }
      } catch (error) {
        console.log(error)
        alert(error + 'Errore, riporva più tardi')
      }
      
    }

    const handleLogout = () =>{
        setToken(null)
        setUserInfo(null)
        localStorage.removeItem('token')
        handleCloseLogoutModal()
        alert('Logout effettuato')
    }
  
    // console.log(posts)
    return (
      <Container fluid="sm">
        <h1 className="blog-main-title mb-3">Benvenuto sul PMS!</h1>
        {!token && <Button variant="primary" className="me-2" onClick={handleShow}>
          Login
        </Button>}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>LOGIN</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" onChange={handleChange} placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} placeholder="your password" />
        </Form.Group>
        </Form>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleLogin}>
              Login now
            </Button>
          </Modal.Footer>
        </Modal>
        {token && <Button className="ms-2 me-2" variant="dark" onClick={handleShowLogoutModal}>
            Logout
          </Button>}
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
        {token && (    <Row className="my-4 justify-content-center">
          <Col xs={12} md={4} className="mb-4 d-flex justify-content-center">
            <ArrivalSummary className="mx-auto" />
          </Col>
          <Col xs={12} md={4} className="mb-4 d-flex justify-content-center">
            <DepartureSummary className="mx-auto" />
          </Col>
          <Col xs={12} md={4} className="mb-4 d-flex justify-content-center">
            <InHouseSummary className="mx-auto" />
          </Col>
        </Row>) }
        {token && <Todays />}
        {token && <TodaysDep />}
        {token && <TodaysHouse />} 
      </Container>
    );
  };

  export default Home;
  