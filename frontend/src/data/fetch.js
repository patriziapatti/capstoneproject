//FETCH PER LA LOGIN
export const login = async (formValue) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      headers: {
        "Content-Type": "application/json",
      },
      method: 'POST',
      body: JSON.stringify(formValue)
    })
    if (res.ok) {
      const data = await res.json();
      return data
    } else {
      const errorData = await res.json()
      return { error: errorData.message || 'Errore di login' }
    }
  } catch (error) {
    return { error: 'Errore, riporva più tardi' }
  }
}

//FETCH ME
export const me = async () => {
  const res = await fetch('http://localhost:5000/api/auth/me', {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  })
  if (!res.ok) {
    throw new Error(res.status)
  }
  const data = await res.json();
  return data
}

//FETCH PER MOSTRARE ARRIVI DI OGGI
export const getTodaysArrivals = async () => {
  const res = await fetch('http://localhost:5000/api/bookings/todayarr', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
  const data = await res.json();
  return data
}

//FETCH PER MOSTRARE PARTENZE DI OGGI
export const getTodaysDeparture = async () => {
  const res = await fetch('http://localhost:5000/api/bookings/todaydep', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
  const data = await res.json();
  return data
}

//FETCH PER MOSTRARE IN HOUSE TODAY
export const getTodaysInHouse = async () => {
  const res = await fetch('http://localhost:5000/api/bookings/inhouse', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
  const data = await res.json();
  return data
}

//FETCH PER OTTENERE NUMERO TOTALE DI ROOMS
export const getAllRooms = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/rooms', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    return data.totalResults; // Restituisci il numero totale di camere
  } catch (error) {
    console.error("Errore nel recuperare il numero di camere:", error);
    return 0; // Se c'è un errore, restituisci 0 o gestisci l'errore come preferisci
  }
};

//FETCH PER OTTENERE ROOMS DISPONIBILI
export const getAvailableRooms = async ({ checkInDate, checkOutDate, adults, children }) => {
  try {
    const urlBase = 'http://localhost:5000/api/rooms/availableRoom/?';
    // const url = `${urlBase}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`;

    const url = urlBase + new URLSearchParams({
      checkInDate,
      checkOutDate,
      adults,
      children,
    });
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Errore ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Errore durante il fetch delle stanze disponibili:", error);
    throw error;
  }
};

//FETCH ALL CUSTOMERS
export const getAllCustomer = async (search) => {
  try {
    const urlBase = 'http://localhost:5000/api/customers';
    const searchParam = search ? `name=${search}` : '';
    const url = `${urlBase}?${searchParam}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Errore ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Errore durante la fetch dei customer:", error);
    throw error;
  }
};


//FETCH PER CERCARE IL CUSTOMER
//   export const searchCustomer = async (query) => {
//     try {
//         const res = await fetch(`http://localhost:5000/api/customers/search?query=${query}`, {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             },
//         });

//         if (res.ok) {
//             const data = await res.json();
//             return data; // Restituisce i clienti trovati
//         } else {
//             const errorData = await res.json();
//             return { error: errorData.message || 'Cliente non trovato' };
//         }
//     } catch (error) {
//         return { error: 'Errore di connessione, riprova più tardi' };
//     }
// };

//FETCH PER CREARE UN NUOVO CUSTOMER
export const addNewCustomer = async (customerData) => {
  try {
    const url = 'http://localhost:5000/api/customers';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(customerData),
    });

    if (!res.ok) {
      throw new Error(`Errore ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Errore durante l'aggiunta del customer:", error);
    throw error;
  }
};

//FETCH PER CREARE UNA NUOVA BOOKING
export const addNewBooking = async (bookingData) => {
  try {
    const url = 'http://localhost:5000/api/bookings';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      throw new Error(`Errore ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Errore durante l'aggiunta della prenotazione:", error);
    throw error;
  }
};

//FETCH PER MODIFICARE LA PASSWORD
export const changeUserPassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }), // Converte i dati in JSON
    });

    // Controlla se la risposta è OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante l\'aggiornamento della password');
    }

    // Se tutto è andato a buon fine, gestisci la risposta di successo
    const data = await response.json();
    console.log('Password aggiornata con successo:', data.message);
    return data.message;
  } catch (error) {
    console.error('Errore durante la modifica della password:', error.message);
    return error.message;
  }
}


//FETCH PER RECUPERARE LE PRENOTAZIONI CON CHECK IN DA OGGI IN POI
export const getBookingsForPlanning = async (page = 1, perPage = 15) => {
  try {
    const response = await fetch(`http://localhost:5000/api/bookings/booking-planning?page=${page}&perPage=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Se l'endpoint richiede autenticazione
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante il recupero delle prenotazioni');
    }

    const bookings = await response.json();
    return bookings;
  } catch (error) {
    console.error('Errore durante il recupero delle prenotazioni:', error.message);
    return {
      dati: [],
      totalResults: 0,
      totalPages: 0,
      page: 1,
      perPage: 15,
    };
  }
};

//FETCH PER RECUPERARE TUTTI I GUESTS
export const getAllGuests = async (page = 1, perPage = 15) => {
  try {
    const response = await fetch(`http://localhost:5000/api/customers?page=${page}&perPage=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante il recupero degli ospiti');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore durante il recupero degli ospiti:', error.message);
    return [];
  }
};

//FETCH PER ELIMINARE UNA BOOKING
export const deleteBookingById = async (bookingId) => {
  try {
    // Invio della richiesta DELETE al server
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante l\'eliminazione della prenotazione');
    }

    // Se la richiesta ha successo, restituisci il messaggio di conferma
    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Errore durante l\'eliminazione della prenotazione:', error.message);
    throw error;
  }
};

//FETCH PER MODIFICARE UNA BOOKING:
export const editBooking = async (bookingId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Errore durante la modifica della prenotazione');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore durante la modifica della prenotazione:', error);
    throw error;
  }
};

//FETCH PER RECUPERARE LA SINGOLA BOOKING
export const getSingleBooking = async (bookingId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante il recupero della prenotazione.');
    }

    const booking = await response.json();
    return booking;
  } catch (error) {
    console.error('Errore durante il recupero della prenotazione:', error.message);
    throw error;
  }
};



//FETCH PER RECUPERARE IL SINGOLO GUEST
export const getSingleGuest = async (customerId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante il recupero dell ospite.');
    }

    const guest = await response.json();
    return guest;
  } catch (error) {
    console.error('Errore durante il recupero dell ospite:', error.message);
    throw error;
  }
};


//FETCH PER AGGIORNERE LO STATUS DELLA PRENOTAZIONE (check in & out)

export const updateBookingStatus = async (id, status) => {
  const response = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(status),
  });
  if (!response.ok) {
    throw new Error("Errore durante l'aggiornamento dello stato della prenotazione.");
  }
};

//FETCH PER CHIAMARE TUTTE LE CAMERE
export const fetchAllRooms = async (page = 1, perPage = 20) => {
  try {
    const response = await fetch(`http://localhost:5000/api/rooms?page=${page}&perPage=${perPage}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Errore durante il recupero delle stanze');
    }
    return await response.json();
  } catch (error) {
    console.error('Errore nella fetch delle stanze:', error);
    throw error;
  }
};

//FETCH PER CHIAMARE TUTTI GLI UTENTI
export const fetchAllUsers = async (page = 1, perPage = 9) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users?page=${page}&perPage=${perPage}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
    });
    if (!response.ok) {
      throw new Error('Errore durante il recupero degli utenti');
    }
    return await response.json();
  } catch (error) {
    console.error('Errore nella fetch degli utenti:', error);
    throw error;
  }
};

//FETCH PER ELIMINARE UNA UN OSPITE
export const deleteGuestById = async (customerId) => {
  try {
    // Invio della richiesta DELETE al server
    const response = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante l\'eliminazione dell ospite');
    }

    // Se la richiesta ha successo, restituisci il messaggio di conferma
    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell ospite:', error.message);
    throw error;
  }
};

//FETCH PER MODIFICARE UN OSPITE
export const editGuestById = async (guestId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/customers/${guestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Errore nella modifica dell'ospite`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//FETCH PER ELIMINARE UNA UNA ROOM
export const deleteRoomById = async (roomId) => {
  try {
    // Invio della richiesta DELETE al server
    const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante l\'eliminazione della room');
    }

    // Se la richiesta ha successo, restituisci il messaggio di conferma
    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Errore durante l\'eliminazione della room:', error.message);
    throw error;
  }
};

//FETCH PER MODIFICARE UNA CAMERA
export const editRoomById = async (roomId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Errore nella modifica della camera`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//FETCH PER ELIMINARE UNA UN USER
export const deleteUserById = async (userId) => {
  try {
    // Invio della richiesta DELETE al server
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Errore durante l\'eliminazione dell\'utente');
    }

    // Se la richiesta ha successo, restituisci il messaggio di conferma
    const message = await response.text();
    return message;
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'utente', error.message);
    throw error;
  }
};

//FETCH PER MODIFICARE UN UTENTE
export const editUserById = async (userId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error(`Errore nella modifica dell'utente'`);
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//FETCH PER AGGIUNGERE UNA NUOVA ROOM
export const addRoom = async (newRoom) => {
  try {
    const response = await fetch('http://localhost:5000/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newRoom),
    });

    if (!response.ok) {
      throw new Error('Errore durante l\'aggiunta della nuova stanza');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

//FETCH PER AGGIUNGERE UN NUOVO UTENTE
export const addUser = async (newUser) => {
  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error('Errore durante l\'aggiunta del nuovo utente');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};