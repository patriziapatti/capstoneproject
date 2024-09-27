import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContextProvider"
import { getTodaysArrivals, getTodaysDeparture, getTodaysInHouse } from "../data/fetch"
import { Table, Spinner, Alert } from "react-bootstrap";


const Todays = props => {
    const {token,setToken} = useContext(UserContext)
    const [arrivals, setArrivals] = useState("")
    const [departures, setDepartures] = useState("")
    const [inHouse, setInHouse] = useState("")
    const [loading, setLoading] = useState(true); // Stato per il caricamento
    const [error, setError] = useState(null); // Stato per l'errore
  

    useEffect(() => {
        const fetchArrivals = async () => {
          try {
            const data = await getTodaysArrivals();
            setArrivals(data.arrivingToday);
          } catch (err) {
            setError("Errore nel recupero dei dati.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchArrivals();
      }, []);


    return(
        <div>
      <h1 className="mb-4">Arrivi di oggi</h1>

      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}
      
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && arrivals && arrivals.length > 0 ? (
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
            {arrivals.map((arrival, index) => {
                const checkInDate = new Date (arrival.checkInDate)
                const checkOutDate = new Date (arrival.checkOutDate)
                const timeDifference = checkOutDate - checkInDate
                const numberOfNight = timeDifference / (1000 * 60 * 60 * 24)
                return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{arrival.customer.name} {arrival.customer.surname }</td>
                      <td>{checkInDate.toLocaleDateString()}</td>
                      <td>{checkOutDate.toLocaleDateString()}</td>
                      <td>{arrival.room.roomNumber}</td>
                      <td>{arrival.room.type}</td>
                      <td>{arrival.pax.adults}</td>
                      <td>{arrival.pax.children}</td>
                      <td>{numberOfNight} notti</td>
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