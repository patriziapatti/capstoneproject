import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Form, Alert, Dropdown, Button, Spinner } from "react-bootstrap";
import { getAllCustomer, addNewCustomer, addNewBooking, getAvailableRooms } from "../data/fetch";
import { Navigate, useNavigate } from "react-router-dom";

const New = () => {
    const { token, setToken } = useContext(UserContext);
    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]); // Stato per le stanze disponibili
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);  // Stato per gestire errori
    const [filteredCustomers, setFilteredCustomers] = useState([]);  // Stato per gestire i risultati filtrati
    const [selectedCustomer, setSelectedCustomer] = useState(null);  // Stato per gestire il customer selezionato
    const [newCustomer, setNewCustomer] = useState(false);  // Stato per gestire se bisogna creare un nuovo customer
    const [isRoomsLoaded, setIsRoomsLoaded] = useState(false) // Stato per sapere se le stanze sono caricate
    const [isBookingLoading, setIsBookingLoading] = useState(false); // Stato per gestire il caricamento
    const [formData, setFormData] = useState({
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("success");

    const navigate = useNavigate()

    // Funzione per gestire la ricerca del customer
    const handleSearch = (event) => {
        const searchValue = event.target.value.trim();
        setSearch(searchValue);

        if (searchValue) {
            const matchingCustomers = customers.filter((customer) =>
                customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                customer.surname.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredCustomers(matchingCustomers);
        } else {
            setFilteredCustomers([]);
        }
    };

    // Funzione per gestire il cambiamento dei campi del form
    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    // Effettua la fetch dei customers
    useEffect(() => {
        const fetchData = async () => {
            if (!search) {
                setCustomers([]);
                setFilteredCustomers([]);
                return;
            }

            try {
                const data = await getAllCustomer(search);
                setCustomers(data.dati);
                setError(null);
            } catch (err) {
                console.error("Errore durante il fetch dei customer:", err);
                setError("Errore nel caricamento dei customer.");
            }
        };
        fetchData();
    }, [search]);

    const fetchAvailableRooms = async () => {
        const { checkInDate, checkOutDate, adults, children } = formData;

        if (checkInDate && checkOutDate && adults > 0) {
            try {
                const data = await getAvailableRooms({ checkInDate, checkOutDate, adults, children });
                setRooms(data.dati);
                setError(null);
                setIsRoomsLoaded(true);  // Imposta lo stato su true se la fetch è andata a buon fine
            } catch (err) {
                console.error("Errore durante la fetch delle stanze disponibili:", err);
                console.log(err);
                if (err.status !== 400) {
                    setError("Errore nel caricamento delle stanze disponibili.");
                    setIsRoomsLoaded(false);  // Mantieni lo stato su false in caso di errore
                }

            }
        }
    };
    const handleVerifyRoomClick = () => {
        fetchAvailableRooms();
    }

    // Effettua la fetch delle stanze disponibili in base a date e pax
    // useEffect(() => {

    //     fetchAvailableRooms();
    // }, [formData.checkInDate, formData.checkOutDate, formData.adults, formData.children]);

    // Gestisce la selezione di un customer
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSearch(`${customer.name} ${customer.surname}`);
        setFilteredCustomers([]);
        setNewCustomer(false);
    };

    // Gestisce il caso in cui non viene trovato alcun customer
    const handleAddNewCustomer = () => {
        setNewCustomer(true);
        setSelectedCustomer(null);
    };

    // Gestisce l'aggiunta di un nuovo customer
    const handleSubmitNewCustomer = async (event) => {
        event.preventDefault();
        const form = event.target;
        const customerData = {
            name: form.name.value,
            surname: form.surname.value,
            dateOfBirth: form.dateOfBirth.value,
            email: form.email.value,
            phone: form.phone.value,
        };

        try {
            const newCustomer = await addNewCustomer(customerData);
            setSelectedCustomer(newCustomer);
            setNewCustomer(false);
        } catch (err) {
            console.error("Errore nell'aggiunta del customer:", err);
            setError("Errore durante l'aggiunta del customer.");
        }
    };

    // Gestisce l'invio della nuova prenotazione
    const handleSubmitBooking = async (event) => {
        event.preventDefault();
        setIsBookingLoading(true); //inizia il caricamento
        const form = event.target;
        const bookingData = {
            customer: selectedCustomer._id,
            room: form.room.value,
            checkInDate: form.checkInDate.value,
            checkOutDate: form.checkOutDate.value,
            pax: {
                adults: parseInt(form.adults.value),
                children: parseInt(form.children.value),
            },
            // totalPrice: parseFloat(form.totalPrice.value),
        };

        try {
            await addNewBooking(bookingData);
            // alert("Prenotazione aggiunta con successo!");
            showAlertMessage("Prenotazione aggiunta con successo!", "success");
            setIsBookingLoading(false)
            setTimeout(() => {
                navigate("/bookings");
              }, 2000); // Aspetta 2 secondi
        } catch (err) {
            console.error("Errore durante l'aggiunta della prenotazione:", err);
            // showAlertMessage("Errore durante l'aggiunta della prenotazione.", "danger");
            setError("Errore durante l'aggiunta della prenotazione.");
            setIsBookingLoading(false)
        }
    };

    const showAlertMessage = (message, variant) => {
        setAlertMessage(message);
        setAlertVariant(variant);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Nasconde l'alert dopo 3 secondi
    };

    // Form per la prenotazione secondo lo schema specificato
    const renderBookingForm = () => {
        return (
            <Form className="w-50" onSubmit={handleSubmitBooking}>
                <h3>Nuova Prenotazione per {selectedCustomer.name} {selectedCustomer.surname}</h3>
                <Form.Group controlId="formBookingCheckIn">
                    <Form.Label>Data Check-In</Form.Label>
                    <Form.Control type="date" name="checkInDate" value={formData.checkInDate} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formBookingCheckOut">
                    <Form.Label>Data Check-Out</Form.Label>
                    <Form.Control type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formPaxAdults">
                    <Form.Label>Numero di Adulti</Form.Label>
                    <Form.Control type="number" name="adults" min="1" value={formData.adults} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formPaxChildren">
                    <Form.Label>Numero di Bambini</Form.Label>
                    <Form.Control type="number" name="children" min="0" value={formData.children} onChange={handleInputChange} required />
                </Form.Group>
                <Button className="mt-2 btn-bg-color" type="button" onClick={handleVerifyRoomClick}>
                    Verifica Disponibilità
                </Button>

                {/* Mostra la selezione delle stanze solo se le stanze sono state caricate */}
                {isRoomsLoaded && (
                    <Form.Group controlId="formBookingRoom">
                        <Form.Label className="mt-2">Stanze Disponibili</Form.Label>
                        <Form.Control className="mt-2" as="select" name="room" required>
                            <option value="">Seleziona una stanza...</option>
                            {rooms.map((room) => (
                                <option key={room._id} value={room._id}>{room.roomNumber} - Capacità: {room.maxPax}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                )}
                {/* <Form.Group controlId="formBookingTotalPrice">
                    <Form.Label>Prezzo Totale (€)</Form.Label>
                    <Form.Control type="number" name="totalPrice" min="0" step="0.01" required />
                </Form.Group> */}
                {isRoomsLoaded && (<Button className="mt-3 btn-bg-color" variant="primary" type="submit" disabled={isBookingLoading}>
                    {isBookingLoading ? <Spinner animation="border" size="lg" /> : "Conferma Prenotazione"}
                </Button>)}
            </Form>

        );
    };

    // Form per aggiungere un nuovo customer
    const renderNewCustomerForm = () => {
        return (
            <Form className="w-50" onSubmit={handleSubmitNewCustomer}>
                <h3>Aggiungi Nuovo Cliente</h3>
                <Form.Group controlId="formCustomerName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Inserisci il nome" required />
                </Form.Group>
                <Form.Group controlId="formCustomerSurname">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control type="text" name="surname" placeholder="Inserisci il cognome" required />
                </Form.Group>
                <Form.Group controlId="formCustomerEmail">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="text" name="email" placeholder="Inserisci l'email" required />
                </Form.Group>
                <Form.Group controlId="formCustomerName">
                    <Form.Label>Data di nascita</Form.Label>
                    <Form.Control type="date" name="dateOfBirth" placeholder="Inserisci la data di nascita" required />
                </Form.Group>
                <Form.Group controlId="formCustomerName">
                    <Form.Label>Telfono</Form.Label>
                    <Form.Control type="number" name="phone" placeholder="Inserisci il numero di telefono" required />
                </Form.Group>
                <Button className="mt-2 btn-bg-color" type="submit">
                    Aggiungi Cliente
                </Button>
            </Form>
        );
    };

    return (<>
        {token && <Container>
            <h2 className="pt-3">Nuova Prenotazione</h2>
           
            <Form className="d-flex position-relative">
                <Form.Control
                    type="search"
                    placeholder="Search customer"
                    className="me-2 mb-2 w-25"
                    aria-label="Search"
                    name="search"
                    value={search}
                    onChange={handleSearch}
                />
 {showAlert && (
            <Alert
              variant={alertVariant}
              className="text-center w-50 mx-auto mt-3"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}
                {/* Dropdown menu per mostrare i risultati */}
                {filteredCustomers.length > 0 && (
                    <Dropdown.Menu show className="w-25 position-absolute" style={{ top: '100%' }}>
                        {filteredCustomers.map((customer) => (
                            <Dropdown.Item
                                key={customer._id}
                                onClick={() => handleSelectCustomer(customer)}
                            >
                                {customer.name} {customer.surname}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )}
            </Form>

            {/* Mostra un messaggio di errore se c'è un problema */}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Se non troviamo alcun customer, mostra il pulsante per aggiungerne uno nuovo */}
            {search && !filteredCustomers.length && !selectedCustomer && !newCustomer && (
                <Button className="btn-bg-color" onClick={handleAddNewCustomer}>
                    Aggiungi Nuovo Cliente
                </Button>
            )}

            {/* Se è stato selezionato un customer, mostra il form per la nuova prenotazione */}
            {selectedCustomer && renderBookingForm()}

            {/* Se nessun customer è stato selezionato e vogliamo aggiungere un nuovo customer, mostra il form */}
            {newCustomer && renderNewCustomerForm()}
        </Container>}
    </>
    );
};

export default New;

