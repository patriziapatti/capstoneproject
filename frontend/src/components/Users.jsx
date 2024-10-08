import { useEffect, useState, useRef } from "react";
import { fetchAllUsers, deleteUserById, editUserById } from "../data/fetch";
import './Users.css'
import { Alert, Form, Button } from "react-bootstrap";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteError, setDeleteError] = useState(''); // Messaggio di errore specifico per la cancellazione
  const [deleteSuccess, setDeleteSuccess] = useState(''); // Messaggio di successo specifico per la cancellazione
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Effettua la chiamata all'endpoint degli utenti e imposta lo stato
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchAllUsers(currentPage);
        setUsers(data.dati);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento degli utenti');
        setLoading(false);
      }
    };
    loadUsers();
  }, [currentPage]);

  // Referenza per il form di modifica
  const formRef = useRef(null);
  useEffect(() => {
    if (editSuccess) setTimeout(() => setEditSuccess(''), 3000);
    if (editError) setTimeout(() => setEditError(''), 3000);
    if (deleteSuccess) setTimeout(() => setDeleteSuccess(''), 3000);
    if (deleteError) setTimeout(() => setDeleteError(''), 3000);
  }, [editSuccess, editError, deleteSuccess, deleteError]);

  // Esegui lo scroll al form di modifica quando selectedRoom cambia
  useEffect(() => {
    if (selectedUser && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedUser]);


  const handleDelete = async (userId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      try {
        await deleteUserById(userId);
        setUsers(users.filter((user) => user._id !== userId));
        setDeleteSuccess('Utente Eliminato Correttamente')
        setDeleteError('')
      } catch (err) {
        setDeleteError('Errore durante l\'eliminazione della dell\'utente.');
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    // scrollToForm(); // Scorre la pagina fino al form di modifica
    // setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (selectedUser) {
      try {
        const updatedUser = await editUserById(selectedUser._id, selectedUser);
        setUsers(users.map((user) => (user._id === selectedUser._id ? updatedUser : user)));
        console.log(selectedUser)
        setEditSuccess('Utente modificato con successo!');
        setSelectedUser(null); // Chiude il form dopo la modifica
        // setShowModal(false);
      } catch (err) {
        setEditError('Errore durante la modifica dell\'utente.');
      }
    }
  };

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Tutti gli Utenti</h2>

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

      <div className="mb-2" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {users.map(user => (
          <div
            key={user._id}
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              width: '300px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              backgroundColor: '#f7f7f7',
            }}
            className="user-card "
          >
            <h3 style={{ margin: '0', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
              {user.name} {user.surname}
            </h3>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Cognome:</strong> {user.surname}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* <p><strong>Verificato:</strong> {user.verifiedAt ? 'Sì' : 'No'}</p> */}

            {/* Sezione Pulsanti */}
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
              <button
               onClick={() => handleEdit(user)}
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
                onClick={() => handleDelete(user._id)}
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
          </div>
        ))}
      </div>

      {/* Paginazione */}
      <div className="mb-2" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          style={{ margin: '0 10px' }}
          className="btn btn-primary"

        >
          Indietro
        </button>
        <span>Pagina {currentPage} di {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ margin: '0 10px' }}
          className="btn btn-primary"
        >
          Avanti
        </button>
      </div>

      {editSuccess && <Alert variant="success" dismissible>{editSuccess}</Alert>}
      {editError && <Alert variant="danger" dismissible>{editError}</Alert>}

      {/* Form di Modifica sotto  */}
      {selectedUser && (
        <div ref={formRef} className="edit-form-container p-3 border mt-4 w-25">
          <h4>Modifica Utente</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.surname}
                onChange={(e) => setSelectedUser({ ...selectedUser, surname: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={selectedUser.username}
                onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Ospiti</Form.Label>
              <Form.Control
                type="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-start">
              <Button className="me-1" variant="dark" onClick={() => setSelectedUser(null)}>X</Button>
              <Button variant="success" onClick={handleSaveEdit}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
              </svg></Button>
            </div>
          </Form>
        </div>
      )}

    </div>
  );
}

export default Users;