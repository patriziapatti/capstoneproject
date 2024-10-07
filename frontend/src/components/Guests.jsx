import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { getAllCustomer, getAllGuests, deleteGuestById } from "../data/fetch";
import { Container, Spinner, Alert, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './style.css'


function Guests() {
  const { token, setToken, userInfo, setUserInfo } = useContext(UserContext)
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [deleteError, setDeleteError] = useState(''); // Messaggio di errore specifico per la cancellazione
  const [deleteSuccess, setDeleteSuccess] = useState(''); // Messaggio di successo specifico per la cancellazione


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

  const handleDelete = async (customerId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo ospite?')) {
      try {
        await deleteGuestById(customerId);
        setGuests(guests.filter((guest) => guest._id !== customerId));
        setDeleteSuccess('Ospite Eliminato Correttamente')
        setDeleteError('')
      } catch (err) {
        setDeleteError('Errore durante l\'eliminazione della dell ospite.');
      }
    }
  };

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

       {/* Mostra messaggio di successo per la cancellazione */}
       {deleteSuccess && (
            <Alert variant="success" onClose={() => setDeleteSuccess('')} dismissible>
              {deleteSuccess}
            </Alert>
          )}

          {/* Mostra messaggio di errore per la cancellazione */}
          {deleteError && (
            <Alert variant="danger" onClose={() => setDeleteError('')} dismissible>
              {deleteError}
            </Alert>
          )}


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
        <Table striped bordered hover className="transparent-table">
          <thead>
            <tr>
              <th>ID Ospite</th>
              <th>Nome Ospite</th>
              {/* <th>Data di Nascita</th>
              <th>Telefono</th> */}
              <th>ID Prenotazioni</th>
              <th>Azioni</th>
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
                    variant="link" style={{ color: 'inherit', padding: 0 }}
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
                        <span><Button variant="link" style={{ color: 'inherit', padding: 0 }} onClick={() => handleViewDetails(booking._id)}>
                          {booking._id}
                        </Button></span>
                      </div>
                    ))
                  ) : (
                    'Nessuna Prenotazione'
                  )}</td>
                  <td><div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
                    <button
                      // onClick={() => handleEdit(guest._id)}
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        backgroundColor: '#17a2b8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      className="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                      </svg>
                    </button>
                    <button
                    
                      onClick={() => handleDelete(guest._id)}
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      className="button"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                      </svg>
                    </button>
                  </div>
                    {/* <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(guest._id)}
                    >
                      Edit
                    </Button> */}
                    {/* <Button
                      variant="danger"
                      onClick={() => handleDelete(guest._id)}
                    >
                      Delete
                    </Button> */}
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