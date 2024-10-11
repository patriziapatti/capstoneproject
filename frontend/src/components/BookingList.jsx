import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Table, Spinner, Alert, Button, Form, Pagination , Modal } from 'react-bootstrap';
import { getBookingsForPlanning, deleteBookingById, getOldBookings } from "../data/fetch";
import { useNavigate } from 'react-router-dom';
import EditBookingForm from "./EditBookingForm";


function BookingList() {
  const { token, setToken, userInfo, setUserInfo } = useContext(UserContext)
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState(''); // Messaggio di errore specifico per la cancellazione
  const [deleteSuccess, setDeleteSuccess] = useState(''); // Messaggio di successo specifico per la cancellazione
  //   const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [perPage] = useState(15); // Fissa il numero di elementi per pagina 

  const [oldBookings, setOldBookings] = useState([]); // Stato per le vecchie prenotazioni
  const [viewOldBookings, setViewOldBookings] = useState(false); // Controlla se visualizzare le vecchie prenotazioni
  const [oldCurrentPage, setOldCurrentPage] = useState(1); // Nuovo stato per la pagina corrente
  const [oldTotalPages, setOldTotalPages] = useState(1); // Nuovo stato per il numero totale di pagine
  const [oldTotalResults, setOldTotalResults] = useState(0); // Nuovo stato per il numero totale di risultati

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const navigate = useNavigate();

  // Stato per la prenotazione in modifica
  const [editingBooking, setEditingBooking] = useState(null);

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
  }, [currentPage, perPage, editingBooking]);

  // Funzione per recuperare le vecchie prenotazioni con paginazione
  const fetchOldBookings = async (pageNumber = 1) => {
    try {
      const data = await getOldBookings(pageNumber, perPage);
      setOldBookings(data.dati);
      setOldTotalPages(data.totalPages);
      setOldTotalResults(data.totalResults);
      setOldCurrentPage(pageNumber);
    } catch (error) {
      setError('Errore durante il recupero delle vecchie prenotazioni.');
    }
  };

  const toggleOldBookings = () => {
    if (!viewOldBookings) {
      fetchOldBookings();
    }
    setViewOldBookings(!viewOldBookings);
  };

  // Funzione per cambiare pagina delle prenotazioni storiche
  const handleOldPageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= oldTotalPages) {
      fetchOldBookings(pageNumber);
    }
  };

  //funzione per eliminare la booking
  const handleDelete = (bookingId) => {
    setBookingToDelete(bookingId); // Salva l'ID della prenotazione da eliminare
    setShowDeleteModal(true); // Mostra il modale di conferma
  };

  const confirmDelete = async () => {
    try {
      await deleteBookingById(bookingToDelete);
      setBookings(bookings.filter((booking) => booking._id !== bookingToDelete));
      setDeleteSuccess('Prenotazione Eliminata Correttamente');
      setDeleteError('');
    } catch (err) {
      setDeleteError('Impossibile eliminare la prenotazione.');
    } finally {
      setShowDeleteModal(false); // Chiudi il modale dopo l'operazione
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

  const handleEditClick = (booking) => {
    setEditingBooking(booking); // Setta la prenotazione in modifica
  };

  const handleSave = () => {
    setEditingBooking(null); // Chiude il form di modifica
    // Ricarica i dati della tabella dopo la modifica
    setCurrentPage(1);
  };

  return (
    <>
      {token && (
        <Container className="mt-5">
          {editingBooking ? "" : <h2>Prossime prenotazioni</h2>}

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
              {editingBooking ? "" : <Table bordered hover className="table-titles">
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
                          <Button variant="link" className="custom-link " style={{ color: 'inherit', padding: 0 }} onClick={() => handleViewDetails(booking._id)}>
                            {booking._id.toUpperCase()}
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="link" className="custom-link "
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
                            onClick={() => handleEditClick(booking)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '12px',
                              backgroundColor: '#1abc9c',
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
                            onClick={() => handleDelete(booking._id)}
                            style={{
                              padding: '5px 10px',
                              fontSize: '12px',
                              backgroundColor: '#FFA500',
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>}

              {/* Pagina e Paginazione */}
              {editingBooking ? "" : <div className="d-flex justify-content-between align-items-center mt-3">
                {/* <span>
                Mostrando {bookings.length} di {totalResults} prenotazioni.
              </span> */}
                <Pagination className="custom-pagination">
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
              </div>}
              {editingBooking && (
                <EditBookingForm
                  booking={editingBooking}
                  onSave={handleSave}
                  onCancel={() => setEditingBooking(null)}
                  token={token}
                />
              )}
            </>
          )}

          <Button onClick={toggleOldBookings} className="ml-2 mb-3" variant="link">
            {viewOldBookings ? ">> Nascondi Prenotazioni Passate" : ">>Visualizza Prenotazioni Passate"}
          </Button>
          {/* Visualizzazione della tabella condizionale */}
          {viewOldBookings && (
            <div>
              <h2>Archivio Prenotazioni</h2>
              <Table bordered hover className="table-titles">
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
                  {oldBookings.map((oldBooking) => (
                    <tr key={oldBooking._id}>
                      <td><Button variant="link" className="custom-link " style={{ color: 'inherit', padding: 0 }} onClick={() => handleViewDetails(oldBooking._id)}>
                        {oldBooking._id.toUpperCase()}
                      </Button></td>
                      <td>
                        <Button
                          variant="link" className="custom-link "
                          style={{ color: 'inherit', padding: 0 }}
                          onClick={() => handleViewGuestDetails(oldBooking.customer._id)}
                        >
                          {oldBooking.customer.name} {oldBooking.customer.surname}
                        </Button>
                      </td>
                      <td>{new Date(oldBooking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(oldBooking.checkOutDate).toLocaleDateString()}</td>
                      <td>{oldBooking.room.roomNumber}</td>
                      <td>{oldBooking.room.type}</td>
                      <td>{oldBooking.pax.adults}</td>
                      <td>{oldBooking.pax.children}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* Paginazione per le vecchie prenotazioni */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Pagination className="custom-pagination">
                  <Pagination.Prev onClick={() => handleOldPageChange(oldCurrentPage - 1)} disabled={oldCurrentPage === 1} />
                  {[...Array(oldTotalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === oldCurrentPage}
                      onClick={() => handleOldPageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handleOldPageChange(oldCurrentPage + 1)} disabled={oldCurrentPage === oldTotalPages} />
                </Pagination>
              </div>

            </div>
          )}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header className="modal-header-custom" closeButton>
              <Modal.Title>Conferma Eliminazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>Sei sicuro di voler eliminare questa prenotazione?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Annulla
              </Button>
              <Button className="btn-bg-color" onClick={confirmDelete}>
                Elimina
              </Button>
            </Modal.Footer>
          </Modal>
        </Container >
      )
      }
    </>
  );
}

export default BookingList;