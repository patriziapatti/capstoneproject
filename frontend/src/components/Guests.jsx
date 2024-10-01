import { useContext , useEffect, useState} from "react";
import { UserContext } from "../context/UserContextProvider";
import { getAllCustomer, getAllGuests } from "../data/fetch";
import { Container, Spinner, Alert, Table, Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function Guests(){
    const {token, setToken, userInfo, setUserInfo} = useContext(UserContext)
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
     // Recupera i guests quando il componente viene montato
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getAllGuests();
        setGuests(data);
      } catch (err) {
        setError(err.message || 'Errore durante il recupero degli ospiti.');
      } finally {
        setLoading(false);
      }
    };
    console.log(guests)
    fetchGuests();
  }, []); 


  // Funzione per navigare alla pagina dei dettagli della prenotazione
  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`); // Reindirizza alla pagina con i dettagli della prenotazione
  };

   // Funzione per navigare alla pagina dei dettagli dell'ospite
   const handleViewGuestDetails = (guestId) => {
    navigate(`/guests/${guestId}`); // Reindirizza alla pagina con i dettagli dell'ospite
  };

    return (<>
    {token && <Container className="mt-5">
        <h2>Lista Ospiti</h2>
        {/* Gestione dello stato di caricamento e degli errori */}
      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        // Mostra la tabella con i dati delle prenotazioni
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Ospite</th>
              <th>Nome Ospite</th>
              {/* <th>Data di Nascita</th>
              <th>Telefono</th> */}
              <th>ID Prenotazioni</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Nessun Ospite Trovato.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest._id}>
                   <td> <Button
                          variant="link"style={{ color: 'inherit', padding: 0 }}
                          onClick={() => handleViewGuestDetails(guest._id)}
                        >
                          {guest._id}
                        </Button></td> 
                  <td>{guest.name} {guest.surname} </td>
                  {/* <td>{new Date(guest.dateOfBirth).toLocaleDateString()}</td>
                  <td>{guest.phone}</td> */}
                  <td>{guest.bookings && guest.bookings.length > 0 ? (
            guest.bookings.map((booking) => (
              <div key={booking._id}>
                <span><Button variant="link" style={{ color: 'inherit', padding: 0 }}onClick={() => handleViewDetails(booking._id)}>
                          {booking._id}
                        </Button></span>
              </div>
            ))
          ) : (
            'Nessuna Prenotazione'
          )}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                    //   onClick={() => handleEdit(guest._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      // onClick={() => handleDelete(guest._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
        </Container>}
    </>)
}

export default Guests