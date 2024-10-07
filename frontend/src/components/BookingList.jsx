import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Table, Spinner, Alert, Button , Form, Pagination} from 'react-bootstrap';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [perPage] = useState(15); // Fissa il numero di elementi per pagina a 20
  const navigate = useNavigate();

  // Recupera le prenotazioni quando il componente viene montato
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookingsForPlanning(currentPage, perPage);
        setBookings(data.dati);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError(err.message || 'Errore durante il recupero delle prenotazioni.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentPage, perPage]); 

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

  // Funzione per navigare alla pagina dei dettagli della prenotazione
  const handleViewDetails = (bookingId) => {
    navigate(`/booking/${bookingId}`); // Reindirizza alla pagina con i dettagli della prenotazione
  };
 // Funzione per navigare alla pagina dei dettagli dell'ospite
 const handleViewGuestDetails = (guestId) => {
  navigate(`/guests/${guestId}`); // Reindirizza alla pagina con i dettagli dell'ospite
};

// Gestione della navigazione tra pagine
const handlePageChange = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    setCurrentPage(pageNumber);
  }
};

return (
  <>
    {token && (
      <Container className="mt-5">
        <h2>Prossime prenotazioni</h2>

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
          <>
            {/* Mostra la tabella con i dati delle prenotazioni */}
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
                  <th>Status</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Nessuna prenotazione trovata.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <Button variant="link" style={{ color: 'inherit', padding: 0 }} onClick={() => handleViewDetails(booking._id)}>
                          {booking._id}
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          style={{ color: 'inherit', padding: 0 }}
                          onClick={() => handleViewGuestDetails(booking.customer._id)}
                        >
                          {booking.customer.name} {booking.customer.surname}
                        </Button>
                      </td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>{booking.room.roomNumber}</td>
                      <td>{booking.room.type}</td>
                      <td>{booking.pax.adults}</td>
                      <td>{booking.pax.children}</td>
                      <td>{booking.status.toUpperCase()}</td>
                      <td className="d-flex justify-content-between">
                        <button
                                style={{
                                    padding: '5px 10px',
                                    fontSize: '12px',
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                className="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg>
                            </button>
                
                        <button
                        onClick={() => handleDelete(booking._id)}
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
  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
</svg>
                            </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {/* Pagina e Paginazione */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* <span>
                Mostrando {bookings.length} di {totalResults} prenotazioni.
              </span> */}
              <Pagination>
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </>
        )}
      </Container>
    )}
  </>
);
}

export default BookingList;