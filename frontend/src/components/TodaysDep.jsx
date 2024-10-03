import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContextProvider"
import { getTodaysDeparture, updateBookingStatus } from "../data/fetch"
import { Table, Spinner, Alert , Form} from "react-bootstrap";


const TodaysDep = props => {
  const { token, setToken } = useContext(UserContext)
  // const [arrivals, setArrivals] = useState("")
  const [departures, setDepartures] = useState("")
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per l'errore
  const [success, setSuccess] = useState(null); // Stato per il messaggio di successo
  const [checkedOutStatus, setCheckedOutStatus] = useState({}); // Stato per le checkbox dei check-out


  useEffect(() => {
    const fetchDepartures = async () => {
      try {
        const data = await getTodaysDeparture();
        setDepartures(data.departingToday);

        // Inizializza lo stato dei check-out per le prenotazioni in partenza oggi
        const initialStatus = data.departingToday.reduce((acc, departure) => {
          acc[departure._id] = departure.status === "checkedOut";
          return acc;
        }, {});
        setCheckedOutStatus(initialStatus);
      } catch (err) {
        setError("Errore nel recupero dei dati.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartures();
  }, []);

    // Funzione per gestire il cambio dello stato della checkbox
    const handleCheckOutChange = async (departureId) => {
      try {
        await updateBookingStatus(departureId, { status: "checkedOut" });
        // Aggiorna lo stato locale per riflettere il cambiamento
        setCheckedOutStatus((prevStatus) => ({
          ...prevStatus,
          [departureId]: true,
        }));
        // Visualizza il messaggio di successo
        setSuccess(`Check-out avvenuto con successo `);
        // Nascondi il messaggio di successo dopo 3 secondi
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Errore durante il check-out:", error);
        setError("Errore durante il check-out. Riprova più tardi.");
      }
    };


  return (
    <div>
      <h1 className="mb-4">Partenze di oggi</h1>

      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!loading && departures && departures.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome Ospite</th>
              <th>Data di Arrivo</th>
              <th>Data di Partenza</th>
              <th>Stanza</th>
              <th>Tipologia</th>
              <th>Adulti</th>
              <th>Bambini</th>
              <th>Durata Soggiorno</th>
              <th>Check-out</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((departure, index) => {
              const checkInDate = new Date(departure.checkInDate)
              const checkOutDate = new Date(departure.checkOutDate)
              const timeDifference = checkOutDate - checkInDate
              const numberOfNight = timeDifference / (1000 * 60 * 60 * 24)
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{departure.customer.name} {departure.customer.surname}</td>
                  <td>{checkInDate.toLocaleDateString()}</td>
                  <td>{checkOutDate.toLocaleDateString()}</td>
                  <td>{departure.room.roomNumber}</td>
                  <td>{departure.room.type}</td>
                  <td>{departure.pax.adults}</td>
                  <td>{departure.pax.children}</td>
                  <td>{numberOfNight} notti</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={checkedOutStatus[departure._id] || false}
                      disabled={checkedOutStatus[departure._id]} // Disabilita la checkbox se già "checked-out"
                      onChange={() => handleCheckOutChange(departure._id)}
                      label={checkedOutStatus[departure._id] ? "Checked-out" : "Check-out"}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : (
        !loading && <Alert variant="info">Nessuna partenza prevista per oggi.</Alert>
      )}
    </div>
  )
}

export default TodaysDep