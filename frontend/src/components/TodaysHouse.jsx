import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContextProvider"
import { getTodaysArrivals, getTodaysDeparture, getTodaysInHouse } from "../data/fetch"
import { Table, Spinner, Alert } from "react-bootstrap";


const TodaysHouse = props => {
    const {token,setToken} = useContext(UserContext)
    // const [arrivals, setArrivals] = useState("")
    // const [departures, setDepartures] = useState("")
    const [inHouse, setInHouse] = useState("")
    const [loading, setLoading] = useState(true); // Stato per il caricamento
    const [error, setError] = useState(null); // Stato per l'errore
  

    useEffect(() => {
        const fetchInHouse = async () => {
          try {
            const data = await getTodaysInHouse();
            console.log(data.inHouseToday)
            setInHouse(data.inHouseToday);
          } catch (err) {
            setError("Errore nel recupero dei dati.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchInHouse();
      }, []);


    return(
        <div>
      <h1 className="mb-4">Prenotazioni in house</h1>

      {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}
      
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && inHouse && inHouse.length > 0 ? (
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
            </tr>
          </thead>
          <tbody>
            {inHouse.map((inh, index) => {
                const checkInDate = new Date (inh.checkInDate)
                const checkOutDate = new Date (inh.checkOutDate)
                const timeDifference = checkOutDate - checkInDate
                const numberOfNight = timeDifference / (1000 * 60 * 60 * 24)
                return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{inh.customer.name} {inh.customer.surname }</td>
                      <td>{checkInDate.toLocaleDateString()}</td>
                      <td>{checkOutDate.toLocaleDateString()}</td>
                      <td>{inh.room.roomNumber}</td>
                      <td>{inh.room.type}</td>
                      <td>{inh.pax.adults}</td>
                      <td>{inh.pax.children}</td>
                      <td>{numberOfNight} notti</td>
                    </tr>
                  )
            })}
          </tbody>
        </Table>
      ) : (
        !loading && <Alert variant="info">Nessun cliente in house previsto per oggi.</Alert>
      )}
    </div>
    )
}

export default TodaysHouse