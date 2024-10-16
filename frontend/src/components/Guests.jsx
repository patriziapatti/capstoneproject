import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContextProvider";
import { getAllCustomer, getAllGuests, deleteGuestById, editGuestById } from "../data/fetch";
import { Container, Spinner, Alert, Table, Button, Modal, Form, Pagination } from "react-bootstrap";
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
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [perPage] = useState(15); // Fissa il numero di elementi per pagina 

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);

  // Referenza per il form di modifica
  const formRef = useRef(null);

  // Recupera i guests quando il componente viene montato
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getAllGuests(currentPage, perPage);
        setGuests(data.dati);
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError(err.message || 'Errore durante il recupero degli ospiti.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, [currentPage, perPage]);

  useEffect(() => {
    if (editSuccess) setTimeout(() => setEditSuccess(''), 3000);
    if (editError) setTimeout(() => setEditError(''), 3000);
    if (deleteSuccess) setTimeout(() => setDeleteSuccess(''), 6000);
    if (deleteError) setTimeout(() => setDeleteError(''), 6000);
  }, [editSuccess, editError, deleteSuccess, deleteError]);

  // Esegui lo scroll al form di modifica quando selectedGuest cambia
  useEffect(() => {
    if (selectedGuest && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedGuest]);

  const handleDelete = (customerId) => {
    setGuestToDelete(customerId); // Salva l'ID della prenotazione da eliminare
    setShowDeleteModal(true); // Mostra il modale di conferma
  };

  const confirmDelete = async () => {
    try {
      await deleteGuestById(guestToDelete);
      setGuests(guests.filter((guest) => guest._id !== guestToDelete));
      setDeleteSuccess('Ospite Eliminato Correttamente');
      setDeleteError('');
    } catch (err) {
      setDeleteError('Impossibile eliminare l\'ospite.');
    } finally {
      setShowDeleteModal(false); // Chiudi il modale dopo l'operazione
    }
  };

  const handleEdit = (guest) => {
    setSelectedGuest(guest);
    // scrollToForm(); // Scorre la pagina fino al form di modifica
    // setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (selectedGuest) {
      try {
        const updatedGuest = await editGuestById(selectedGuest._id, selectedGuest);
        setGuests(guests.map((guest) => (guest._id === selectedGuest._id ? updatedGuest : guest)));
        console.log(selectedGuest)
        setEditSuccess('Ospite modificato con successo!');
        setSelectedGuest(null); // Chiude il form dopo la modifica
        // setShowModal(false);
      } catch (err) {
        setEditError('Errore durante la modifica dell\'ospite.');
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
        <Table bordered hover className="transparent-table table-titles">
          <thead>
            <tr >
              {/* <th>ID Ospite</th> */}
              <th>Nome Ospite</th>
              <th>Data di Nascita</th>
              {/*<th className="table-titles ">Telefono</th> */}
              <th>Prenotazioni</th>
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
                  {/* <td> <Button
                    variant="link" style={{ color: 'inherit', padding: 0 }}
                    onClick={() => handleViewGuestDetails(guest._id)}
                  >
                    {guest._id}
                  </Button></td>  */}
                  <td><Button
                    variant="link" className="custom-link " style={{ color: 'inherit', padding: 0 }}
                    onClick={() => handleViewGuestDetails(guest._id)}
                  >
                    {guest.surname} {guest.name}</Button></td>
                  <td>{new Date(guest.dateOfBirth).toLocaleDateString()}</td>
                  {/*<td>{guest.phone}</td> */}
                  <td>{guest.bookings && guest.bookings.length > 0 ? (
                    guest.bookings.map((booking) => (
                      <div key={booking._id}>
                        <span><Button variant="link" className="custom-link " style={{ color: 'inherit', padding: 0 }} onClick={() => handleViewDetails(booking._id)}>
                          {booking._id.toUpperCase()}
                        </Button></span>
                      </div>
                    ))
                  ) : (
                    'Nessuna Prenotazione'
                  )}</td>
                  <td><div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
                    <button
                      onClick={() => handleEdit(guest)}
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

                      onClick={() => handleDelete(guest._id)}
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
                  </div>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
      {/* Pagina e Paginazione */}
      <div className="d-flex justify-content-between align-items-center mt-3">

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
      </div>

      {editSuccess && <Alert variant="success" dismissible>{editSuccess}</Alert>}
      {editError && <Alert variant="danger" dismissible>{editError}</Alert>}



      {/* Form di Modifica sotto la Tabella */}
      {selectedGuest && (
        <div ref={formRef} className="edit-form-container p-3 border mt-4 w-25 mx-auto">
          <h4>Modifica Ospite</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedGuest.name}
                onChange={(e) => setSelectedGuest({ ...selectedGuest, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                value={selectedGuest.surname}
                onChange={(e) => setSelectedGuest({ ...selectedGuest, surname: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={selectedGuest.email}
                onChange={(e) => setSelectedGuest({ ...selectedGuest, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="tel"
                value={selectedGuest.phone}
                onChange={(e) => setSelectedGuest({ ...selectedGuest, phone: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-start">
              <Button className="me-1 btn-bg-color-orange " onClick={() => setSelectedGuest(null)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg></Button>
              <Button className="btn-bg-color" onClick={handleSaveEdit}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
              </svg></Button>
            </div>
          </Form>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header className="modal-header-custom" closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler eliminare quest'ospite?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button className="btn-bg-color" onClick={confirmDelete}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>}
  </>)
}

export default Guests