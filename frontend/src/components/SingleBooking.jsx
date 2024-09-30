import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { getSingleBooking } from '../data/fetch';


const SingleBooking = () =>{
    const { id } = useParams(); // Ottieni l'ID della prenotazione dai parametri dell'URL
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchBookingDetails = async () => {
          try {
            const data = await getSingleBooking(id); // Richiesta per ottenere i dettagli della prenotazione
            setBooking(data);
          } catch (err) {
            setError(err.message || 'Errore durante il recupero della prenotazione.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchBookingDetails();
      }, [id]);


    return(<>
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
            <h2>Dettagli Prenotazione</h2>
          </Card.Header>
          <Card.Body>
            <p><strong>ID Prenotazione:</strong> {booking._id}</p>
            <p><strong>Nome Cliente:</strong> {booking.customer.name} {booking.customer.surname}</p>
            <p><strong>Email Cliente:</strong> {booking.customer.email}</p>
            <p><strong>Data Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Data Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Stanza:</strong> {booking.room.roomNumber}</p>
            <p><strong>Tipologia:</strong> {booking.room.type}</p>
            <p><strong>Prezzo Totale:</strong> {booking.totalPrice}€</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  
    </>)
}

export default SingleBooking