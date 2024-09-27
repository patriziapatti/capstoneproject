import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContextProvider"
import { getTodaysArrivals, getTodaysDeparture, getTodaysInHouse } from "../data/fetch"
import { Table, Spinner, Alert } from "react-bootstrap";


const TodaysDep = props => {
    const {token,setToken} = useContext(UserContext)
    // const [arrivals, setArrivals] = useState("")
    const [departures, setDepartures] = useState("")
    const [inHouse, setInHouse] = useState("")
    const [loading, setLoading] = useState(true); // Stato per il caricamento
    const [error, setError] = useState(null); // Stato per l'errore
  

    useEffect(() => {
        const fetchDepartures = async () => {
          try {
            const data = await getTodaysDeparture();
            setDepartures(data.departingToday);
          } catch (err) {
            setError("Errore nel recupero dei dati.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchDepartures();
      }, []);


    return(
        <div>
      <h1 className="mb-4">Partenze di oggi</h1>

      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}
      
      {error && <Alert variant="danger">{error}</Alert>}

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
            </tr>
          </thead>
          <tbody>
            {departures.map((departure, index) => {
                const checkInDate = new Date (departure.checkInDate)
                const checkOutDate = new Date (departure.checkOutDate)
                const timeDifference = checkOutDate - checkInDate
                const numberOfNight = timeDifference / (1000 * 60 * 60 * 24)
                return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{departure.customer.name} {departure.customer.surname }</td>
                      <td>{checkInDate.toLocaleDateString()}</td>
                      <td>{checkOutDate.toLocaleDateString()}</td>
                      <td>{departure.room.roomNumber}</td>
                      <td>{departure.room.type}</td>
                      <td>{departure.pax.adults}</td>
                      <td>{departure.pax.children}</td>
                      <td>{numberOfNight} notti</td>
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