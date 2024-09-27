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