import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContextProvider"
import { getTodaysArrivals, updateBookingStatus } from "../data/fetch"
import { Table, Spinner, Alert ,Form} from "react-bootstrap";


const Todays = props => {
  const { token, setToken } = useContext(UserContext)
  const [arrivals, setArrivals] = useState("")
  const [departures, setDepartures] = useState("")
  const [inHouse, setInHouse] = useState("")
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [error, setError] = useState(null); // Stato per l'errore
  const [success, setSuccess] = useState(null); // Stato per il messaggio di successo
  const [checkedInStatus, setCheckedInStatus] = useState({}); // Stato per i check-in


  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const data = await getTodaysArrivals();
        setArrivals(data.arrivingToday);
        // Inizializza lo stato per il checkedIn
        const initialStatus = data.arrivingToday.reduce((acc, arrival) => {
          acc[arrival._id] = arrival.status === "checkedIn";
          return acc;
        }, {});
        setCheckedInStatus(initialStatus);
      } catch (err) {
        setError("Errore nel recupero dei dati.");
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, []);


   // Funzione per gestire il cambio dello stato della checkbox
   const handleCheckInChange = async (arrivalId) => {
    try {
      // Invia la richiesta per aggiornare lo stato a "checkedIn"
      await updateBookingStatus(arrivalId, { status: "checkedIn" });
      // Aggiorna lo stato locale per riflettere il cambiamento
      setCheckedInStatus((prevStatus) => ({
        ...prevStatus,
        [arrivalId]: true,
      }));
      // Visualizza il messaggio di successo
      setSuccess(`Check-in avvenuto con successo`);
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Errore durante il check-in:", error);
      setError("Errore durante il check-in. Riprova più tardi.");
    }
  };

  return (
    <div>
      <h1 className="mb-4">Arrivi di oggi</h1>

      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!loading && arrivals && arrivals.length > 0 ? (
        <Table  bordered hover responsive className="table-titles">
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
              <th>Check-in</th>
            </tr>
          </thead>
          <tbody>
            {arrivals.map((arrival, index) => {
              const checkInDate = new Date(arrival.checkInDate)
              const checkOutDate = new Date(arrival.checkOutDate)
              const timeDifference = checkOutDate - checkInDate
              const numberOfNight = timeDifference / (1000 * 60 * 60 * 24)
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{arrival.customer.name} {arrival.customer.surname}</td>
                  <td>{checkInDate.toLocaleDateString()}</td>
                  <td>{checkOutDate.toLocaleDateString()}</td>
                  <td>{arrival.room.roomNumber}</td>
                  <td>{arrival.room.type}</td>
                  <td>{arrival.pax.adults}</td>
                  <td>{arrival.pax.children}</td>
                  <td>{numberOfNight} notti</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={checkedInStatus[arrival._id] || false}
                      disabled={checkedInStatus[arrival._id]} // Disabilita la checkbox se già "checked-in"
                      onChange={() => handleCheckInChange(arrival._id)}
                      label={checkedInStatus[arrival._id] ? "Checked-in" : "Check-in"}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : (
        !loading && <Alert variant="info">Nessun arrivo previsto per oggi.</Alert>
      )}
    </div>
  )
}

export default Todays