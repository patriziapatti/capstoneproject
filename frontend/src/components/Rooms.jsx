import { useEffect, useState, useRef } from "react";
import { fetchAllRooms, deleteRoomById, editRoomById, addRoom } from "../data/fetch";
import { Alert, Form, Button , Modal} from "react-bootstrap";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Stato per la pagina attuale
    const [totalPages, setTotalPages] = useState(1); // Stato per il numero totale di pagine
    const [deleteError, setDeleteError] = useState(''); // Messaggio di errore specifico per la cancellazione
    const [deleteSuccess, setDeleteSuccess] = useState(''); // Messaggio di successo specifico per la cancellazione
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({
        roomNumber: '',
        type: '',
        price: '',
        maxPax: '',
    });
    const [addSuccess, setAddSuccess] = useState('');
    const [addError, setAddError] = useState('');


    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState(null);

    // Referenza per il form di modifica
    const formRef = useRef(null);

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                const data = await fetchAllRooms(page);
                setRooms(data.dati);
                setTotalPages(data.totalPages);
                setLoading(false);
            } catch (err) {
                setError('Errore nel caricamento delle stanze');
                setLoading(false);
            }
        };
        loadRooms();
    }, [page]);

    useEffect(() => {
        if (editSuccess) setTimeout(() => setEditSuccess(''), 3000);
        if (editError) setTimeout(() => setEditError(''), 3000);
        if (deleteSuccess) setTimeout(() => setDeleteSuccess(''), 3000);
        if (deleteError) setTimeout(() => setDeleteError(''), 3000);
        if (addSuccess) setTimeout(() => setAddSuccess(''), 3000);
        if (addError) setTimeout(() => setAddError(''), 3000);
    }, [editSuccess, editError, deleteSuccess, deleteError, addSuccess, addError]);



    // Esegui lo scroll al form di modifica quando selectedRoom cambia
    useEffect(() => {
        if (selectedRoom && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedRoom]);

    const handleDelete = (roomId) => {
        setRoomToDelete(roomId); // Salva l'ID della prenotazione da eliminare
        setShowDeleteModal(true); // Mostra il modale di conferma
    };

    const confirmDelete = async () => {
        try {
            await deleteRoomById(roomToDelete);
            setRooms(rooms.filter((room) => room._id !== roomToDelete));
            setDeleteSuccess('Camera Eliminata Correttamente');
            setDeleteError('');
        } catch (err) {
            setDeleteError('Impossibile eliminare la Camera.');
        } finally {
            setShowDeleteModal(false); // Chiudi il modale dopo l'operazione
        }
    };

    const handleEdit = (room) => {
        setSelectedRoom(room);
        // scrollToForm(); // Scorre la pagina fino al form di modifica
        // setShowModal(true);
    };

    const handleSaveEdit = async () => {
        if (selectedRoom) {
            try {
                const updatedRoom = await editRoomById(selectedRoom._id, selectedRoom);
                setRooms(rooms.map((room) => (room._id === selectedRoom._id ? updatedRoom : room)));
                console.log(selectedRoom)
                setEditSuccess('Camera modificata con successo!');
                setSelectedRoom(null); // Chiude il form dopo la modifica
                // setShowModal(false);
            } catch (err) {
                setEditError('Errore durante la modifica della camera.');
            }
        }
    };

    const handleAddRoom = async () => {
        try {
            const addedRoom = await addRoom(newRoom);
            setRooms([...rooms, addedRoom]);
            setNewRoom({ roomNumber: '', type: '', price: '', maxPax: '' });
            setAddSuccess('Camera aggiunta con successo!');
        } catch (err) {
            setAddError('Errore durante l\'aggiunta della camera.');
        }
    };


    if (loading) return <div>Caricamento...</div>;
    if (error) return <div>{error}</div>;
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Tutte le Stanze</h2>

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
                {rooms.map(room => (
                    <div
                        key={room._id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            width: '250px',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}
                        className="user-card "
                    >
                        <h3 style={{ margin: '0', paddingBottom: '10px', borderBottom: '1px solid #ddd' }}>
                            Room {room.roomNumber}
                        </h3>
                        <p><strong>Tipologia:</strong> {room.type}</p>
                        <p><strong>Prezzo:</strong> €{room.price.toFixed(2)}</p>
                        <p><strong>Max Ospiti:</strong> {room.maxPax}</p>
                        <p><strong>Status oggi:</strong> {room.status}</p>
                        {/* Sezione Pulsanti */}
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
                            <button
                                onClick={() => handleEdit(room)}
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
                                onClick={() => handleDelete(room._id)}
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

                    </div>
                ))}
            </div>

            {editSuccess && <Alert variant="success" dismissible>{editSuccess}</Alert>}
            {editError && <Alert variant="danger" dismissible>{editError}</Alert>}

            {/* Paginazione */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={() => setPage(page - 1)} disabled={page <= 1}
                    className={`btn btn-primary ${page >= totalPages ? 'disabled' : ''}`}
                    style={{ margin: '0 10px', background: '#1abc9c', border: 'none' }}>
                    Indietro
                </button>
                <span style={{ margin: '0 10px' }}>Pagina {page} di {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
                    className={`btn btn-primary ${page >= totalPages ? 'disabled' : ''}`}
                    style={{ margin: '0 10px', background: '#1abc9c', border: 'none' }}>
                    Avanti
                </button>
            </div>

            {addSuccess && <Alert variant="success" dismissible>{addSuccess}</Alert>}
            {addError && <Alert variant="danger" dismissible>{addError}</Alert>}
            <div className="d-flex">
                {/* Form di Aggiunta */}
                {!selectedRoom && (
                    <div className="add-form-container p-3 border mt-4 w-50 mx-auto">
                        <h4>Aggiungi Nuova Camera</h4>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Numero</Form.Label>
                                <Form.Control type="number" value={newRoom.roomNumber} onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipologia</Form.Label>
                                <Form.Control type="text" value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Prezzo</Form.Label>
                                <Form.Control type="number" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Max Ospiti</Form.Label>
                                <Form.Control type="number" value={newRoom.maxPax} onChange={(e) => setNewRoom({ ...newRoom, maxPax: e.target.value })} />
                            </Form.Group>
                            <Button className="btn-bg-color" onClick={handleAddRoom}>Aggiungi Camera</Button>
                        </Form>
                    </div>)}

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header className="modal-header-custom" closeButton>
                        <Modal.Title>Conferma Eliminazione</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Sei sicuro di voler eliminare questa camera?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Annulla
                        </Button>
                        <Button className="btn-bg-color" onClick={confirmDelete}>
                            Elimina
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Form di Modifica sotto  */}
                {selectedRoom && (
                    <div ref={formRef} className="edit-form-container p-3 border mt-4 w-50 mx-auto">
                        <h4>Modifica Camera</h4>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Numero</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedRoom.roomNumber}
                                    onChange={(e) => setSelectedRoom({ ...selectedRoom, roomNumber: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipologia</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedRoom.type}
                                    onChange={(e) => setSelectedRoom({ ...selectedRoom, type: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Prezzo</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedRoom.price}
                                    onChange={(e) => setSelectedRoom({ ...selectedRoom, price: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Max Ospiti</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedRoom.maxPax}
                                    onChange={(e) => setSelectedRoom({ ...selectedRoom, maxPax: e.target.value })}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-start">
                                <Button className="me-1 btn-bg-color-orange" onClick={() => setSelectedRoom(null)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg></Button>
                                <Button className="btn-bg-color" onClick={handleSaveEdit}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                </svg></Button>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Rooms;