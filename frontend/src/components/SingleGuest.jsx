import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { getSingleGuest } from '../data/fetch';
import { UserContext } from '../context/UserContextProvider';


const SingleGuest = () =>{
    const {token, setToken, userInfo, setUserInfo} = useContext(UserContext)
    const { id } = useParams(); // Ottieni l'ID della prenotazione dai parametri dell'URL
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchGuestDetails = async () => {
          try {
            const data = await getSingleGuest(id); // Richiesta per ottenere i dettagli dell'ospite
            setGuest(data);
          } catch (err) {
            setError(err.message || 'Errore durante il recupero della prenotazione.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchGuestDetails();
      }, [id]);


    return(<>{token &&
     <Container className="mt-5">
      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Card>
          <Card.Header>
            <h2>Dettagli Ospite</h2>
          </Card.Header>
          <Card.Body>
            <p><strong>ID Ospite:</strong> {guest._id}</p>
            <p><strong>Nome:</strong> {guest.name} {guest.surname}</p>
            <p><strong>Email:</strong> {guest.email}</p>
            <p><strong>Data di nascita:</strong> {new Date(guest.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Telefono:</strong> {guest.phone}</p>
          </Card.Body>
        </Card>
      )}
    </Container>}
  
    </>)
}

export default SingleGuest