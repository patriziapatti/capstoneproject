// import { useContext, useEffect, useState } from "react"
// import { UserContext } from "../context/UserContextProvider"
// import { Container, Form, Alert } from "react-bootstrap"
// import { getAllCustomer } from "../data/fetch"


// const New = () => {
//     const {token,setToken} = useContext(UserContext)
//     const [customers, setCustomers] = useState([])
//     const [search, setSearch] = useState("")
//     const [error, setError] = useState(null);  // Stato per gestire errori

//     const handleSearch = (event) => {
//         setSearch(event.target.value ? event.target.value: "")
//     }
//     useEffect(()=>{
//       const fetchData = async () => {
//         if (!search) {
//           // Se la barra di ricerca è vuota, non fare nulla
//           setCustomers([]);
//           return;
//       }
//         try {
//           const data = await getAllCustomer(search)
//           setCustomers(data.dati)
//           setError(null);  // Reset dell'errore se la fetch è riuscita
//         } catch (err) {
//           console.error("Errore durante il fetch dei customer:", err);
//                 setError("Errore nel caricamento dei customer.");

//         }
//       }
//       fetchData();
//     }, [search]);  // Esegui ogni volta che `search` cambia
    
//     return(
//          <Container>
//              <h2>Nuova Prenotazione</h2>
//            <Form className="d-flex">
//             <Form.Control
//               type="search"
//               placeholder="Search customer"
//               className="me-2 mb-2 w-25"
//               aria-label="Search"
//               name="search"
//             onChange={handleSearch}
//             />
//           </Form> 
//           {/* Mostra un messaggio di errore se c'è un problema */}
//           {error && <Alert variant="danger">{error}</Alert>}
            
//             {/* Mostra la lista dei customer o un messaggio se non ce ne sono */}
//             {customers.length > 0 ? (
//                 <ul>
//                     {customers.map((customer) => (
//                         <li className="list-group-item" key={customer._id}>{customer.name} {customer.surname}</li> 
//                     ))}
//                 </ul>
//             ) : (
//                 !error && <p>Nessun customer trovato.</p>
//             )}
//          </Container>
//     )
// }
// export default New


import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContextProvider";
import { Container, Form, Alert, Dropdown, Button } from "react-bootstrap";
import { getAllCustomer, addNewCustomer, addNewBooking, getAvailableRooms } from "../data/fetch";

const New = () => {
    const { token, setToken } = useContext(UserContext);
    const [customers, setCustomers] = useState([]);
    const [rooms, setRooms] = useState([]); // Stato per le stanze disponibili
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);  // Stato per gestire errori
    const [filteredCustomers, setFilteredCustomers] = useState([]);  // Stato per gestire i risultati filtrati
    const [selectedCustomer, setSelectedCustomer] = useState(null);  // Stato per gestire il customer selezionato
    const [newCustomer, setNewCustomer] = useState(false);  // Stato per gestire se bisogna creare un nuovo customer
    const [formData, setFormData] = useState({
        checkInDate: "",
        checkOutDate: "",
        adults: 1,
        children: 0,
    });

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

    // Effettua la fetch delle stanze disponibili in base a date e pax
    useEffect(() => {
        const fetchAvailableRooms = async () => {
            const { checkInDate, checkOutDate, adults, children } = formData;

            if (checkInDate && checkOutDate && adults > 0) {
                try {
                    const data = await getAvailableRooms({ checkInDate, checkOutDate, adults, children });
                    setRooms(data.dati);
                    setError(null);
                } catch (err) {
                    console.error("Errore durante la fetch delle stanze disponibili:", err);
                    setError("Errore nel caricamento delle stanze disponibili.");
                }
            }
        };
        fetchAvailableRooms();
    }, [formData.checkInDate, formData.checkOutDate, formData.adults, formData.children]);

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
            status: form.status.value,
            totalPrice: parseFloat(form.totalPrice.value),
        };

        try {
            await addNewBooking(bookingData);
            alert("Prenotazione aggiunta con successo!");
        } catch (err) {
            console.error("Errore durante l'aggiunta della prenotazione:", err);
            setError("Errore durante l'aggiunta della prenotazione.");
        }
    };

    // Form per la prenotazione secondo lo schema specificato
    const renderBookingForm = () => {
        return (
            <Form onSubmit={handleSubmitBooking}>
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
                <Form.Group controlId="formBookingRoom">
                    <Form.Label>Stanza Disponibile</Form.Label>
                    <Form.Control as="select" name="room" required>
                        <option value="">Seleziona una stanza...</option>
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>{room.roomNumber} - Capacità: {room.maxPax}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formBookingTotalPrice">
                    <Form.Label>Prezzo Totale (€)</Form.Label>
                    <Form.Control type="number" name="totalPrice" min="0" step="0.01" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Conferma Prenotazione
                </Button>
            </Form>
        );
    };

    // Form per aggiungere un nuovo customer
    const renderNewCustomerForm = () => {
        return (
            <Form onSubmit={handleSubmitNewCustomer}>
                <h3>Aggiungi Nuovo Cliente</h3>
                <Form.Group controlId="formCustomerName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Inserisci il nome" required />
                </Form.Group>
                <Form.Group controlId="formCustomerSurname">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control type="text" name="surname" placeholder="Inserisci il cognome" required />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Aggiungi Cliente
                </Button>
            </Form>
        );
    };

    return (
        <Container>
            <h2>Nuova Prenotazione</h2>
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
                <Button variant="primary" onClick={handleAddNewCustomer}>
                    Aggiungi Nuovo Cliente
                </Button>
            )}

            {/* Se è stato selezionato un customer, mostra il form per la nuova prenotazione */}
            {selectedCustomer && renderBookingForm()}

            {/* Se nessun customer è stato selezionato e vogliamo aggiungere un nuovo customer, mostra il form */}
            {newCustomer && renderNewCustomerForm()}
        </Container>
    );
};

export default New;
























// import React, { useState, useEffect } from 'react';
// import { Form, Button, Col, Row, Container } from 'react-bootstrap';
// import { searchCustomer, addCustomer, addBooking, getAvailableRooms } from '../data/fetch';  // Importa le fetch

// const New = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isCustomerNew, setIsCustomerNew] = useState(false);
//     const [customer, setCustomer] = useState(null);
//     const [newCustomer, setNewCustomer] = useState({
//         name: '',
//         surname: '',
//         email: '',
//         phone: '',
//         dateOfBirth: '',
//     });
//     const [bookingData, setBookingData] = useState({
//         checkInDate: '',
//         checkOutDate: '',
//         pax: { adults: 0, children: 0 },
//         room: '',
//     });
//     const [rooms, setRooms] = useState([]);

//     useEffect(() => {
//         const fetchRooms = async () => {
//             const availableRooms = await getAvailableRooms();
//             setRooms(availableRooms);
//         };
//         fetchRooms();
//     }, []);

//     const handleSearchCustomer = async () => {
//         const result = await searchCustomer(searchQuery); // Chiamata alla fetch con il testo di ricerca
    
//         if (result.error) {
//             console.log("Errore nella ricerca del cliente:", result.error);
//             setIsCustomerNew(true);  // Se non troviamo il cliente, impostiamo per crearne uno nuovo
//         } else {
//             setCustomer(result[0]); // Usa il primo cliente trovato
//             setIsCustomerNew(false);
//         }
//     };

//     const handleCreateCustomer = async () => {
//         const result = await addCustomer(newCustomer);
//         if (!result.error) {
//             setCustomer(result);
//             setIsCustomerNew(false);
//         }
//     };

//     const handleCreateBooking = async () => {
//         const result = await addBooking({
//             ...bookingData,
//             customer: customer._id
//         });
//         if (!result.error) {
//             alert('Prenotazione creata con successo');
//         }
//     };

//     return (
//         <Container>
//             <h2>Nuova Prenotazione</h2>

//             <Form>
//                 {/* Barra di ricerca per il cliente */}
//                 <Form.Group as={Row}>
//                     <Form.Label column sm="2">Cerca cliente:</Form.Label>
//                     <Col sm="8">
//                         <Form.Control
//                             type="text"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Inserisci email o nome cliente"
//                         />
//                     </Col>
//                     <Col sm="2">
//                         <Button onClick={handleSearchCustomer}>Cerca</Button>
//                     </Col>
//                 </Form.Group>

//                 {/* Form per nuovo cliente */}
//                 {isCustomerNew && (
//                     <div>
//                         <h3>Nuovo Cliente</h3>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Nome:</Form.Label>
//                             <Col sm="10">
//                                 <Form.Control
//                                     type="text"
//                                     value={newCustomer.name}
//                                     onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
//                                     placeholder="Nome"
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Cognome:</Form.Label>
//                             <Col sm="10">
//                                 <Form.Control
//                                     type="text"
//                                     value={newCustomer.surname}
//                                     onChange={(e) => setNewCustomer({ ...newCustomer, surname: e.target.value })}
//                                     placeholder="Cognome"
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Email:</Form.Label>
//                             <Col sm="10">
//                                 <Form.Control
//                                     type="email"
//                                     value={newCustomer.email}
//                                     onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
//                                     placeholder="Email"
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Telefono:</Form.Label>
//                             <Col sm="10">
//                                 <Form.Control
//                                     type="tel"
//                                     value={newCustomer.phone}
//                                     onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
//                                     placeholder="Telefono"
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Data di Nascita:</Form.Label>
//                             <Col sm="10">
//                                 <Form.Control
//                                     type="date"
//                                     value={newCustomer.dateOfBirth}
//                                     onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Button onClick={handleCreateCustomer}>Crea Cliente</Button>
//                     </div>
//                 )}

//                 {/* Dettagli prenotazione */}
//                 {customer && (
//                     <div>
//                         <h3>Dettagli Prenotazione</h3>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Check-in:</Form.Label>
//                             <Col sm="4">
//                                 <Form.Control
//                                     type="date"
//                                     value={bookingData.checkInDate}
//                                     onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
//                                 />
//                             </Col>
//                             <Form.Label column sm="2">Check-out:</Form.Label>
//                             <Col sm="4">
//                                 <Form.Control
//                                     type="date"
//                                     value={bookingData.checkOutDate}
//                                     onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Adulti:</Form.Label>
//                             <Col sm="4">
//                                 <Form.Control
//                                     type="number"
//                                     value={bookingData.pax.adults}
//                                     onChange={(e) => setBookingData({ ...bookingData, pax: { ...bookingData.pax, adults: e.target.value } })}
//                                 />
//                             </Col>
//                             <Form.Label column sm="2">Bambini:</Form.Label>
//                             <Col sm="4">
//                                 <Form.Control
//                                     type="number"
//                                     value={bookingData.pax.children}
//                                     onChange={(e) => setBookingData({ ...bookingData, pax: { ...bookingData.pax, children: e.target.value } })}
//                                 />
//                             </Col>
//                         </Form.Group>
//                         <Form.Group as={Row}>
//                             <Form.Label column sm="2">Stanza:</Form.Label>
//                             <Col sm="10">
//                                 <Form.Control
//                                     as="select"
//                                     value={bookingData.room}
//                                     onChange={(e) => setBookingData({ ...bookingData, room: e.target.value })}
//                                 >
//                                     <option value="">Seleziona una stanza</option>
//                                     {rooms.map((room) => (
//                                         <option key={room._id} value={room._id}>
//                                             {room.roomNumber} - {room.type} (€{room.price})
//                                         </option>
//                                     ))}
//                                 </Form.Control>
//                             </Col>
//                         </Form.Group>
//                         <Button onClick={handleCreateBooking}>Crea Prenotazione</Button>
//                     </div>
//                 )}
//             </Form>
//             </Container>
//     );
// };

// export default New;