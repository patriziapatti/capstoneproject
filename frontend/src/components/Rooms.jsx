import { useEffect, useState } from "react";
import { fetchAllRooms } from "../data/fetch";

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1); // Stato per la pagina attuale
    const [totalPages, setTotalPages] = useState(1); // Stato per il numero totale di pagine


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

    if (loading) return <div>Caricamento...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Tutte le Stanze</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
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
                        {/* Sezione Pulsanti */}
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
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
                        </div>

                    </div>
                ))}
            </div>

                   {/* Paginazione */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={() => setPage(page - 1)} disabled={page <= 1} 
                className={`btn btn-primary ${page >= totalPages ? 'disabled' : ''}`}
                style={{ margin: '0 10px' }}>
                    Indietro
                </button>
                <span style={{ margin: '0 10px' }}>Pagina {page} di {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
                    className={`btn btn-primary ${page >= totalPages ? 'disabled' : ''}`}
                    style={{ margin: '0 10px' }}>
                    Avanti
                </button>
            </div>

        </div>
    );
}

export default Rooms;