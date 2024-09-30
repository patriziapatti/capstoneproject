import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Table, Spinner, Alert, Button , Form} from 'react-bootstrap';
import { getBookingsForPlanning, deleteBookingById } from "../data/fetch";
import { useNavigate } from 'react-router-dom';

function BookingList() {
  const {token, setToken, userInfo, setUserInfo} = useContext(UserContext)
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState(''); // Messaggio di errore specifico per la cancellazione
  const [deleteSuccess, setDeleteSuccess] = useState(''); // Messaggio di successo specifico per la cancellazione
  //   const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Recupera le prenotazioni quando il componente viene montato
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsForPlanning();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Errore durante il recupero delle prenotazioni.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []); 

  //funzione per eliminare la booking
  const handleDelete = async (bookingId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      try {
        await deleteBookingById(bookingId);
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        setDeleteSuccess('Prenotazione Eliminata Correttamente')
        setDeleteError('')
        // alert('Prenotazione eliminata')
        // setSuccessMessage(message); // Mostra il messaggio di conferma eliminazione
      } catch (err) {
        setDeleteError('Errore durante l\'eliminazione della prenotazione.');
      }
    }
  };


  return (<>
    {token && <Container className="mt-5">
      <h2>Prossime prenotazioni</h2>

      {/* Mostra messaggio di successo per la cancellazione */}
      {deleteSuccess && <Alert variant="success" onClose={() => setDeleteSuccess('')} dismissible>{deleteSuccess}</Alert>}

      {/* Mostra messaggio di errore per la cancellazione */}
      {deleteError && <Alert variant="danger" onClose={() => setDeleteError('')} dismissible>{deleteError}</Alert>}
      
       {/* Barra di ricerca
       <Form className="my-4">
        <Form.Control
          type="text"
          placeholder="Cerca per cognome del cliente..."
        //   value={searchTerm}
        //   onChange={handleSearch}
        />
      </Form> */}
      
      
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
              <th>ID Prenotazione</th>
              <th>Nome Ospite</th>
              <th>Data di Arrivo</th>
              <th>Data di Partenza</th>
              <th>Stanza</th>
              <th>Tipologia</th>
              <th>Adulti</th>
              <th>Bambini</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Nessuna prenotazione trovata.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.customer.name} {booking.customer.surname}</td>
                  <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td>{booking.room.roomNumber}</td>
                  <td>{booking.room.type}</td>
                  <td>{booking.pax.adults}</td>
                  <td>{booking.pax.children}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                    //   onClick={() => handleEdit(booking._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(booking._id)}
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
    </Container> }
    </>
  );
}

export default BookingList;