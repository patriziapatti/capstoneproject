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
            .sort({ checkInDate: 1 })
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
        const booking = await Booking.findById(id).populate('customer').populate('room')
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
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)

        // Normalizza le date a mezzanotte per evitare problemi di calcolo con l'ora
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        // Ottieni la data odierna senza l'orario
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Controllo che la data di check-in non sia nel passato
        if (checkIn < today || checkOut < today) {
            return res.status(400).send({ message: 'Check-in and check-out dates cannot be in the past' });
        }

        // Controllo che la data di check-in sia precedente a quella di check-out
        if (checkIn > checkOut) {
            return res.status(400).send({ message: 'Check-out date must be after the check-in date' });
        }

        //verifico se ci sono altre booking su quella room che si sovrappongono nello stesso periodo
        const overlappingBooking = await Booking.findOne({
            room: room,
            $or: [
                { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }, // overlaps with an existing booking
            ],
        });
        if (overlappingBooking) {
            return res.status(400).send({ message: 'Room is already booked for the selected dates' });
        }

        const totalPax = pax.adults + pax.children
        if (totalPax > roomData.maxPax) {
            return res.status(400).send({ message: 'Camera non disponibile per il numero di pax richiesto' });
        }

        const pricePerNight = roomData.price;
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

        // Aggiorna il Customer aggiungendo il nuovo booking
        await Customer.findByIdAndUpdate(customer, { $push: { bookings: newBooking._id } });

        const formattedCheckInDate = checkIn.toLocaleDateString('en-GB'); // 'en-GB' per formato DD/MM/YYYY
        const formattedCheckOutDate = checkOut.toLocaleDateString('en-GB')
        try {
            const customer = await Customer.findById(newBooking.customer)
            await transport.sendMail({
                from: 'noreply@epicoders.com', // sender address
                to: customer.email, // list of receivers
                subject: "New Booking", // Subject line
                text: `Dear ${customer.name}, Your Reservation from ${formattedCheckInDate} to ${formattedCheckOutDate} is confirmed! Total price is ${totalPrice}€, to be paid at check-out. We are looking forward to having you as our guest! Please don't hesitate to contact us if you have any questions. Best regards, The Hotel Team`, // plain text body
                html: `<b>Dear ${customer.name}, <br> Your Reservation from ${formattedCheckInDate} to ${formattedCheckOutDate} is confirmed! <br> Total price is ${totalPrice}€, to be paid at check-out. <br><br> We are looking forward to having you as our guest!<br>Please don't hesitate to contact us if you have any questions.<br><br>Best regards,<br>The Hotel Team<b> ` // html body
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
        // Trova la prenotazione esistente
        const booking = await Booking.findById(id).populate('customer').populate('room');
        if (!booking) {
            return res.status(404).send({ message: `Booking with ID ${id} not found` });
        }

        // Se lo stato della prenotazione è diverso da "reserved", non permettere la modifica delle date
        if (booking.status !== 'reserved') {
            return res.status(400).send({
                message: 'Cannot modify check-in or check-out dates for a booking that is already checked-in or out'
            });
        }

        const { checkInDate, checkOutDate, room , pax} = req.body;
        const roomData= await Room.findById(room);

        // Ottieni la data odierna senza l'orario
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let newCheckInDate
        let newCheckOutDate

        // Se la data di check-in è stata modificata, verifica che non sia precedente alla data odierna
        if (checkInDate) {
            newCheckInDate = new Date(checkInDate);
            newCheckInDate.setHours(0, 0, 0, 0);  // Normalizza a mezzanotte

            if (newCheckInDate < today) {
                return res.status(400).send({ message: 'Check-in date cannot be in the past' });
            }
        }

        // Se la stanza o le date sono state modificate, verifica che non ci siano sovrapposizioni
        if (checkInDate && checkOutDate && room) {
            newCheckInDate = new Date(checkInDate);
            newCheckOutDate = new Date(checkOutDate);

            // Normalizza le date a mezzanotte per evitare problemi di calcolo con l'ora
            newCheckInDate.setHours(0, 0, 0, 0);
            newCheckOutDate.setHours(0, 0, 0, 0);

            // Verifica se la stanza è già occupata nel periodo specificato, ignorando la prenotazione attuale
            const overlappingBooking = await Booking.findOne({
                _id: { $ne: id }, // Ignora la prenotazione corrente
                room: roomData._id,
                $or: [
                    { checkInDate: { $lt: newCheckOutDate }, checkOutDate: { $gt: newCheckInDate } },
                ],
            });

            if (overlappingBooking) {
                return res.status(400).send({ message: 'Room is already booked for the selected dates' });
            }
        }

        const totalPax = +pax.adults + +pax.children
        console.log(roomData)
        if (totalPax > roomData.maxPax) {
            return res.status(400).send({ message: 'Camera non disponibile per il numero di pax richiesto' });
        }

        // Aggiorna la prenotazione con i nuovi dati
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true }).populate('room');

        // Ottieni il prezzo per notte della room associata
        const pricePerNight = updatedBooking.room.price;

        // Calcola il numero di notti e il prezzo totale
        const checkIn = new Date(updatedBooking.checkInDate);
        const checkOut = new Date(updatedBooking.checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
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
            text: `Dear ${customerName}, Your reservation has been updated. Here are the new details: Check-in date: ${checkIn.toLocaleDateString('en-GB')}; heck-out date: ${checkOut.toLocaleDateString('en-GB')}. Total price: ${updatedBooking.totalPrice}€, to be paid at check-out. We are looking forward to having you as our guest! Please don't hesitate to contact us if you have any questions or concerns about your updated reservation. Best regards, The Hotel Team`,
            html: `<b>Dear ${customerName}, <br> Your reservation has been updated. <br><br>Here are the new details: Check-in date: ${checkIn.toLocaleDateString('en-GB')}; <br> Check-out date: ${checkOut.toLocaleDateString('en-GB')}. <br> Total price: ${updatedBooking.totalPrice}€, to be paid at check-out.<br><br>We are looking forward to having you as our guest!<br>Please don't hesitate to contact us if you have any questions or concerns about your updated reservation.<br><br>Best regards,<br>ThemHotel Team</b>`
        });

        res.status(200).send(updatedBooking);
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
                    text: `Dear ${customerName}, Your Reservation from ${checkInDate} to ${checkOutDate} is cancelled. We hope to have the opportunity to welcome you as our guest in the near future. Please don't hesitate to reach out if you need assistance with rebooking or have any further questions. We look forward to hosting you soon. Best regards, The Hotel Team `, // plain text body
                    html: `<b>Dear ${customerName}, <br> Your Reservation from ${checkInDate} to ${checkOutDate} is cancelled. <br> <br> We hope to have the opportunity to welcome you as our guest in the near future. <br> Please don't hesitate to reach out if you need assistance with rebooking or have any further questions. <br> <br> We look forward to hosting you soon.<br> <br> Best regards,<br> <br> The Hotel Team<b>` // html body
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

export const updatedBookingStatus = async (req, res) => {
    const { id } = req.params; // ID della prenotazione
    const { status } = req.body; // Nuovo status (checkedIn o checkedOut)

    try {
        // Trova la prenotazione esistente
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).send({ message: `Booking with ID ${id} not found` });
        }

        // Verifica che lo status sia valido
        const validStatuses = ['reserved', 'checkedIn', 'checkedOut'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ message: 'Invalid status. Valid statuses are: reserved, checkedIn, checkedOut.' });
        }

        // Se lo status è "checkedIn", verifica che la data attuale sia la data di check-in
        if (status === 'checkedIn') {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalizza la data attuale a mezzanotte
            const checkInDate = new Date(booking.checkInDate);
            checkInDate.setHours(0, 0, 0, 0); // Normalizza la data di check-in a mezzanotte

            if (today < checkInDate) {
                return res.status(400).send({ message: 'You can only check in on or after the check-in date.' });
            }
        }

        // Se lo status è "checkedOut", verifica che la data attuale sia la data di check-out o successiva
        if (status === 'checkedOut') {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalizza la data attuale a mezzanotte
            const checkOutDate = new Date(booking.checkOutDate);
            checkOutDate.setHours(0, 0, 0, 0); // Normalizza la data di check-out a mezzanotte

            if (today < checkOutDate) {
                return res.status(400).send({ message: 'You can only check out on or after the check-out date.' });
            }
        }

        // Aggiorna solo lo status della prenotazione
        booking.status = status;
        await booking.save();

        res.status(200).send({ message: `Booking status updated to ${status}` });
    } catch (error) {
        res.status(500).send({ message: `Error updating booking status: ${error.message}` });
    }
};

export const getTodaysArrivals = async (req, res) => {
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        // Ottieni la data odierna senza l'orario
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        // Imposta la fine del giorno
        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Trova le prenotazioni in arrivo oggi
        const bookingsArrivingToday = await Booking.find({
            checkInDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('customer').populate('room')
            .collation({ locale: 'it' }) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({ checkInDate: 1 })
            .skip((page - 1) * perPage)//salto la pagina precedente
            .limit(perPage)
        const totalResults = await Booking.countDocuments({
            checkInDate: { $gte: startOfDay, $lte: endOfDay }
        })// mi da il numero totale delle prenotazioni in casa oggi
        const totalPages = Math.ceil(totalResults / perPage)

        // Rispondi con i risultati trovati
        res.status(200).json({
            arrivingToday: bookingsArrivingToday,
            totalResults,
            totalPages,
            page,
        });
    } catch (error) {
        res.status(500).send({ message: `Error fetching bookings: ${error.message}` });
    }
};

export const getTodaysDeparture = async (req, res) => {
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        // Ottieni la data odierna senza l'orario
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        // Imposta la fine del giorno
        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Trova le prenotazioni in partenza oggi
        const bookingsDepartingToday = await Booking.find({
            checkOutDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('customer').populate('room')
            .collation({ locale: 'it' }) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({ checkInDate: 1 })
            .skip((page - 1) * perPage)//salto la pagina precedente
            .limit(perPage)
        const totalResults = await Booking.countDocuments({
            checkOutDate: { $gte: startOfDay, $lte: endOfDay }
        })// mi da il numero totale delle prenotazioni in casa oggi
        const totalPages = Math.ceil(totalResults / perPage)

        // Rispondi con i risultati trovati
        res.status(200).json({
            departingToday: bookingsDepartingToday,
            totalResults,
            totalPages,
            page,
        });
    } catch (error) {
        res.status(500).send({ message: `Error fetching bookings: ${error.message}` });
    }
};

export const getTodaysInHouse = async (req, res) => {
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        // Ottieni la data odierna senza l'orario
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        // Imposta la fine del giorno
        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);
     
        // Trova le prenotazioni in casa oggi
        const bookingsInHouseToday = await Booking.find({
            checkInDate: { $lte: endOfDay }, // check-in deve essere avvenuto prima della fine di oggi
            checkOutDate: { $gt: startOfDay }// check-out deve essere dopo l'inizio di oggi
        }).populate('customer').populate('room')
            .collation({ locale: 'it' }) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({ checkInDate: 1 })
            .skip((page - 1) * perPage)//salto la pagina precedente
            .limit(perPage)
        const totalResults = await Booking.countDocuments({
            checkInDate: { $lte: endOfDay },
            checkOutDate: { $gt: startOfDay }
        })// mi da il numero totale delle prenotazioni in casa oggi
        const totalPages = Math.ceil(totalResults / perPage)

        // Rispondi con i risultati trovati
        res.status(200).json({
            inHouseToday: bookingsInHouseToday,
            totalResults,
            totalPages,
            page,
        });
    } catch (error) {
        res.status(500).send({ message: `Error fetching bookings: ${error.message}` });
    }
};

export const getBookingsForPlanning = async (req, res) => {
    try {
        //ottengo la data di ieri
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        yesterday.setUTCHours(0, 0, 0, 0)//imposto l'orario a mezzanotte

        const page = req.query.page || 1
        let perPage = req.query.perPage || 15
        perPage = perPage > 15 ? 15 : perPage

        //trovo le prenotazioni con data di check-in maggiore di ieri
        const bookings = await Booking.find({
            checkInDate: { $gt: yesterday }
        })
            .collation({ locale: 'it' }) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({ checkInDate: 1 })
            .skip((page - 1) * perPage)//salto la pagina precedente
            .limit(perPage)
            .populate('customer').populate('room')

        const totalResults = await Booking.countDocuments({
            checkInDate: { $gt: yesterday }
        })

        const totalPages = Math.ceil(totalResults / perPage)

        res.status(200).send({
            dati: bookings,
            totalResults,
            totalPages,
            page,
            perPage,
        })
    } catch (error) {
        res.status(500).send({ message: `Errore durante il recupero delle prenotazioni: ${error.message}` })
    }
}

export const getOldBookings = async (req, res) => {
    try {
        //ottengo la data di ieri
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        yesterday.setUTCHours(0, 0, 0, 0)//imposto l'orario a mezzanotte

        const page = req.query.page || 1
        let perPage = req.query.perPage || 15
        perPage = perPage > 20 ? 15 : perPage

        //trovo le prenotazioni con data di check-in minore di ieri
        const bookings = await Booking.find({
            checkInDate: { $lte: yesterday }
        })
            .collation({ locale: 'it' }) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({ checkInDate: -1 })
            .skip((page - 1) * perPage)//salto la pagina precedente
            .limit(perPage)
            .populate('customer').populate('room')

        const totalResults = await Booking.countDocuments({
            checkInDate: { $lte: yesterday }
        })

        const totalPages = Math.ceil(totalResults / perPage)

        res.status(200).send({
            dati: bookings,
            totalResults,
            totalPages,
            page,
            perPage,
        })
    } catch (error) {
        res.status(500).send({ message: `Errore durante il recupero delle prenotazioni: ${error.message}` })
    }
}

