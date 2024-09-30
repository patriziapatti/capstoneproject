import Room from '../models/roomSchema.js'
import Booking from '../models/bookingSchema.js'

export const getAllRooms = async (req,res)=>{
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        const allRooms = await Room.find({})
        .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
        .sort({roomNumber:1}) 
        .skip((page-1)*perPage)//salto la pagina precedente
        .limit(perPage)
        const totalResults = await Room.countDocuments()// mi da il numero totale di documenti
        const totalPages = Math.ceil(totalResults / perPage )  
        res.send({
            dati: allRooms,
            totalResults,
            totalPages,
            page,

        })
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }  
}

export const getSingleRoom = async (req,res)=>{
    const {id} =req.params
    try {
        const room = await Room.findById(id)
        res.status(200).send(room) 
    } catch (error) {
        res.status(404).send({message: 'Not Found'}) 
    } 
}

export const addRoom = async (req,res)=>{
   
    const room = new Room (req.body)
    try {
         //salva i dati prendendoli nel db , prendendoli dall'istanza
        const newRoom = await room.save()
        //invia i dati al database
        res.status(200).send(newRoom)
    } catch (error) {
        res.status(400).send(error)
    }  
}

export const editRoom = async (req,res)=>{
    const {id} =req.params
    try {
        const room = await Room.findByIdAndUpdate(id, req.body, {new:true}) //new serve per restituire in author l'oggetto appena inserito, altrimenti non lo restituisce
        await room.save();
      
        res.status(200).send(room)
    } catch (error) {
        res.status(400).send(error)
    }
    
}

export const deleteRoom = async (req,res)=>{
    const {id} = req.params
    try {
        //verifico se la room esiste
        const roomExists = await Room.exists({_id: id})
        if (!roomExists){
            return res.status(404).send({message: `ID ${id} not found`})
        }

        //verifico se ci sono prenotazioni associate a questa room
        const bookings = await Booking.find({room: id})
        if (bookings.length > 0){
            return res.status(400).send({ message: `La room con ID ${id} ha prenotazioni attive e non può essere eliminata.`});
        }
        await Room.findByIdAndDelete(id)
        res.status(200).send(`ho eliminato la room con id: ${id}`)
    } catch (error) {
        res.status(500).send({ message: `Errore del server durante l'eliminazione della room: ${error.message}` });
    }
}

export const getAvailableRooms = async (req, res) => {
    const { checkInDate, checkOutDate, adults, children } = req.query; // Prendi i parametri di ricerca dalla query string
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 5;
    perPage = perPage > 10 ? 5 : perPage;

    try {
        // Calcola il numero totale di pax (adulti + bambini)
        const totalPax = parseInt(adults) + parseInt(children);

        // Verifica che le date siano valide
        if (!checkInDate || !checkOutDate) {
            return res.status(400).send({ message: 'Check-in and check-out dates are required' });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // Normalizza le date a mezzanotte per evitare problemi di calcolo con l'ora
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        // Controllo che la data di check-in sia precedente a quella di check-out
        if (checkIn >= checkOut) {
            return res.status(400).send({ message: 'Check-out date must be after the check-in date' });
        }

        // Trova tutte le prenotazioni che si sovrappongono con le date selezionate
        const overlappingBookings = await Booking.find({
            $or: [
                { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
            ]
        }).select('room');

        // Crea un array con gli ID delle stanze occupate
        const occupiedRoomIds = overlappingBookings.map(booking => booking.room);

        // Trova tutte le stanze disponibili che soddisfano i criteri di capacità e non sono occupate
        const totalResults = await Room.countDocuments({
            _id: { $nin: occupiedRoomIds },
            maxPax: { $gte: totalPax } // Filtra le stanze che supportano il numero totale di pax
        });

        // Trova tutte le stanze disponibili con paginazione
        const availableRooms = await Room.find({
            _id: { $nin: occupiedRoomIds },
            maxPax: { $gte: totalPax } // Filtra le stanze che supportano il numero totale di pax
        })
        .collation({ locale: 'it' }) // Ignora maiuscole e minuscole nell'ordinamento
        .sort({ roomNumber: 1 })
        .skip((page - 1) * perPage) // Salta la pagina precedente
        .limit(perPage); // Limita i risultati alla pagina corrente

        const totalPages = Math.ceil(totalResults / perPage);

        res.status(200).json({
            dati: availableRooms,
            totalResults,
            totalPages,
            page
        });
    } catch (error) {
        res.status(500).send({ message: `Error fetching available rooms: ${error.message}` });
    }
};

// export const getAvailableRooms = async (req, res) => {
//     const page = req.query.page || 1;
//     let perPage = req.query.perPage || 5;
//     perPage = perPage > 10 ? 5 : perPage;

//     try {
//         // Ottieni la data odierna senza l'orario
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // Trova tutte le prenotazioni che coprono la data odierna
//         const occupiedRooms = await Booking.find({
//             checkInDate: { $lte: today },
//             checkOutDate: { $gt: today }
//         }).select('room');

//         // Crea un array con gli ID delle stanze occupate
//         const occupiedRoomIds = occupiedRooms.map(booking => booking.room);

//         // Trova il numero totale di stanze disponibili
//         const totalResults = await Room.countDocuments({
//             _id: { $nin: occupiedRoomIds }
//         });

//         // Trova tutte le stanze disponibili con paginazione
//         const availableRooms = await Room.find({
//             _id: { $nin: occupiedRoomIds }
//             //L'operatore $nin seleziona i documenti in cui il valore di un campo specificato non corrisponde a nessuno dei valori presenti in un array. 
//             //È come dire "dammi tutti i documenti in cui il valore di questo campo non è nessuno di questi valori".
//             //Esempio:
//             //in una collezione di documenti Room vogliamo trovare tutte le stanze che non sono occupate, possiamo usare $nin:
//         })
//         .collation({ locale: 'it' }) // Serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
//         .sort({ roomNumber: 1 })
//         .skip((page - 1) * perPage) // Salta la pagina precedente
//         .limit(perPage); // Limita i risultati alla pagina corrente

//         const totalPages = Math.ceil(totalResults / perPage);

//         const notAvailable = await Room.countDocuments({
//             _id: { $in: occupiedRoomIds }
//             //L'operatore $in viene utilizzato per selezionare i documenti in cui il valore di un campo specificato è uguale a uno dei valori presenti in un array. 
//             //È come dire "dammi tutti i documenti in cui il valore di questo campo è uno di questi valori".
//             //Esempio:
//             //in una collezione di documenti Room, e vogliamo trovare tutte le stanze i cui ID sono presenti nell' array chiamato occupiedRoomIds.
//         });
//         res.status(200).json({
//             dati: availableRooms,
//             notAvailable: notAvailable,
//             totalResults,
//             totalPages,
//             page
//         });
//     } catch (error) {
//         res.status(500).send({ message: `Error fetching available rooms: ${error.message}` });
//     }
// };

//get che restituisca solo le camere che possono contenere il numero di pax specificato nella booking
// export const getRoomsPerMaxPax = async (req, res) =>{
//     const {adult, children } = req.query

//     //calcola il numero totale di pax (somma di adults+children)
//     const totalPax = parseInt(adults) + parseInt(children);

//     try {
//         // Trova tutte le camere che possono ospitare almeno 'totalPax' persone
//         const rooms = await Room.find({
//             maxPax: { $gte: totalPax }
//         });

//         // Se non ci sono camere trovate
//         if (rooms.length === 0) {
//             return res.status(404).send({ message: 'No rooms available for the requested number of pax' });
//         }

//         // Restituisci le camere disponibili
//         res.status(200).json(rooms);
//     } catch (error) {
//         res.status(500).send({ message: `Error retrieving rooms: ${error.message}` });
//     }
// }