//FETCH PER LA LOGIN
export const login = async (formValue) => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body:JSON.stringify (formValue)
        })
        if(res.ok){
            const data = await res.json();
            return data
        }else {const errorData = await res.json()
            return {error: errorData.message || 'Errore di login'}
        }
    } catch (error) {
        return {error: 'Errore, riporva più tardi'} 
    }    
}

//FETCH ME
export const me = async() =>{
    const res = await fetch('http://localhost:5000/api/auth/me',{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    })
    if(!res.ok){
        throw new Error(res.status)
    }
    const data = await res.json();
    return data
}

//FETCH PER MOSTRARE ARRIVI DI OGGI
export const getTodaysArrivals = async() => {
        const res = await fetch('http://localhost:5000/api/bookings/todayarr', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            const data = await res.json();
            return data
}

//FETCH PER MOSTRARE PARTENZE DI OGGI
export const getTodaysDeparture = async() => {
    const res = await fetch('http://localhost:5000/api/bookings/todaydep', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
        const data = await res.json();
        return data
}

//FETCH PER MOSTRARE IN HOUSE TODAY
export const getTodaysInHouse = async() => {
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
        const urlBase = 'http://localhost:5000/api/rooms/available';
        const url = `${urlBase}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`;

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
export const changeUserPassword = async(currentPassword, newPassword) => {
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
export const getBookingsForPlanning = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings/booking-planning', {
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


  