import { useContext } from "react";
import { UserContext } from "../context/UserContextProvider";
import { getAllCustomer, getAllGuests } from "../data/fetch";
import { Container } from "react-bootstrap";


useContext

const Guests = () =>{
    const {token, setToken, userInfo, setUserInfo} = useContext(UserContext)
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

     // Recupera i guests quando il componente viene montato
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const data = await getAllGuests();
        setGuests(data);
      } catch (err) {
        setError(err.message || 'Errore durante il recupero degli ospiti.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []); 

    return (<>
    {token && <Container className="mt-5">
        <h2>Lista Ospiti</h2>
        </Container>}
    </>)
}

export default Guests