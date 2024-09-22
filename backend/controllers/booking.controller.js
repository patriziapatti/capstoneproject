import Booking from '../models/bookingSchema.js'
import Customer from '../models/customerSchema.js'
import Room from '../models/roomSchema.js'
import transport from '../services/mailService.js'

export const getAllBookings = async (req, res) => {
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        const allBookings = await Booking.find({})
            .collation({ locale: 'it' }) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({ customer: 1 })
            .skip((page - 1) * perPage)//salto la pagina precedente
            .limit(perPage)
        const totalResults = await Booking.countDocuments()// mi da il numero totale di documenti
        const totalPages = Math.ceil(totalResults / perPage)
        res.send({
            dati: allBookings,
            totalResults,
            totalPages,
            page,

        })
    } catch (error) {
        res.status(404).send({ message: 'Not Found' })
    }
}

export const getSingleBooking = async (req, res) => {
    const { id } = req.params
    try {
        const booking = await Booking.findById(id)
        res.status(200).send(booking)
    } catch (error) {
        res.status(404).send({ message: 'Not Found' })
    }
}

export const addBooking = async (req, res) => {

    const { customer, room, checkInDate, checkOutDate, status, pax } = req.body
    let newBooking
    try {
        const roomData = await Room.findById(room)
        if (!roomData) {
            return res.status(400).send({ message: 'Room not Found' })
        }
        const pricePerNight = roomData.price;
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const numberOfNight = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        const totalPrice = pricePerNight * numberOfNight
        newBooking = new Booking({
            customer,
            room,
            checkInDate,
            checkOutDate,
            pax,
            status,
            totalPrice
        })
        await newBooking.save()
        const formattedCheckInDate = checkIn.toLocaleDateString('en-GB'); // 'en-GB' per formato DD/MM/YYYY
        const formattedCheckOutDate = checkOut.toLocaleDateString('en-GB')
        try {
            const customer = await Customer.findById(newBooking.customer)
            await transport.sendMail({
                from: 'noreply@epicoders.com', // sender address
                to: customer.email, // list of receivers
                subject: "New Booking", // Subject line
                text: `Dear ${customer.name}, Your Reservation from ${formattedCheckInDate} to ${formattedCheckOutDate} is confirmed! Total price is ${totalPrice}€, to pay at check-out.`, // plain text body
                html: `<b>Dear ${customer.name}, <br> Your Reservation from ${formattedCheckInDate} to ${formattedCheckOutDate} is confirmed! Total price is ${totalPrice}€, to pay at check-out.<b>` // html body
            })
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        res.status(200).send(newBooking)
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const editBooking = async (req, res) => {
    const { id } = req.params;
    try {
        // Trova e popola la prenotazione esistente
        const booking = await Booking.findById(id).populate('customer').populate('room');
        if (booking) {
            // Aggiorna la prenotazione con i nuovi dati e ripopola il campo room
            const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('room');

            // Ottieni il prezzo per notte della room associata
            const pricePerNight = updatedBooking.room.price;

            // Calcola il numero di notti e il prezzo totale
            const checkInDate = new Date(updatedBooking.checkInDate);
            const checkOutDate = new Date(updatedBooking.checkOutDate);
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            updatedBooking.totalPrice = nights * pricePerNight;

            // Salva la prenotazione aggiornata
            await updatedBooking.save();

            // Prepara i dettagli per l'email
            const customerName = booking.customer.name;
            const customerEmail = booking.customer.email;

            // Invia l'email di conferma
            await transport.sendMail({
                from: 'noreply@epicoders.com',
                to: customerEmail,
                subject: "Booking Updated",
                text: `Dear ${customerName}, Your reservation has been updated. Here are the new details: Check-in from ${checkInDate.toLocaleDateString('en-GB')} to ${checkOutDate.toLocaleDateString('en-GB')}, total price: ${updatedBooking.totalPrice}€.`,
                html: `<b>Dear ${customerName}, <br> Your reservation has been updated. Here are the new details: Check-in from ${checkInDate.toLocaleDateString('en-GB')} to ${checkOutDate.toLocaleDateString('en-GB')}, total price: ${updatedBooking.totalPrice}€.</b>`
            });

            res.status(200).send(updatedBooking);
        } else {
            res.status(404).send({ message: `Booking with ID ${id} not found` });
        }
    } catch (error) {
        res.status(400).send({ message: `Error updating booking: ${error.message}` });
    }
};

export const deleteBooking = async (req, res) => {
    const { id } = req.params
    try {
        const booking = await Booking.findById(id).populate('customer');
        //se l'id esiste nello schema allora fai la delete
        if (await Booking.exists({ _id: id })) {
            const customerEmail = booking.customer.email
            const customerName = booking.customer.name
            const checkInDate = booking.checkInDate.toLocaleDateString('en-GB')
            const checkOutDate = booking.checkOutDate.toLocaleDateString('en-GB')
            await Booking.findByIdAndDelete(id)
            try {
                await transport.sendMail({
                    from: `noreply@epicoders.com`, // sender address
                    to: customerEmail, // list of receivers
                    subject: "New Booking", // Subject line
                    text: `Dear ${customerName}, Your Reservation from ${checkInDate} to ${checkOutDate} is cancelled.`, // plain text body
                    html: `<b>Dear ${customerName}, <br> Your Reservation from ${checkInDate} to ${checkOutDate} is cancelled.<b>` // html body
                })

            } catch (emailError) {
                console.error('Error sending email:', emailError)
            }
            res.status(200).send(`ho eliminato la prenotazione con id: ${id}`)
        } else { res.status(404).send({ message: `ID ${id} not found` }) }
    } catch (error) {
        res.status(404).send({ message: `ID ${id} not found` })
    }
}
//ritorna 200 ma array vuoto
// export const getTodaysArrivals = async (req, res) => {
//     try {
//         // Ottieni la data odierna senza l'orario
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // Trova le prenotazioni in arrivo, in corso e in partenza oggi
//         const bookingsArrivingToday = await Booking.find({ checkInDate: today }).populate('customer').populate('room');
//         // const bookingsInHouseToday = await Booking.find({ checkInDate: { $lt: today }, checkOutDate: { $gt: today } }).populate('customer').populate('room');
//         // const bookingsDepartingToday = await Booking.find({ checkOutDate: today }).populate('customer').populate('room');

//         // Rispondi con i risultati trovati
//         res.status(200).json({
//             arrivingToday: bookingsArrivingToday,
//             // inHouseToday: bookingsInHouseToday,
//             // departingToday: bookingsDepartingToday
//         });
//     } catch (error) {
//         res.status(500).send({ message: `Error fetching bookings: ${error.message}` });
//     }
// };

export const getTodaysArrivals = async (req, res) => {
    try {
        // Ottieni la data odierna senza l'orario
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Imposta la fine del giorno
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Trova le prenotazioni in arrivo oggi
        const bookingsArrivingToday = await Booking.find({
            checkInDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('customer').populate('room');

        // Rispondi con i risultati trovati
        res.status(200).json({
            arrivingToday: bookingsArrivingToday,
        });
    } catch (error) {
        res.status(500).send({ message: `Error fetching bookings: ${error.message}` });
    }
};
// export const editBooking = async (req, res) => {
//     const { id } = req.params
//     try {
//         const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true }) //new serve per restituire in author l'oggetto appena inserito, altrimenti non lo restituisce
//         await booking.save();

//         res.status(200).send(booking)
//     } catch (error) {
//         res.status(400).send(error)
//     }

// }