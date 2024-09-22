import Booking from '../models/bookingSchema.js'
import Customer from '../models/customerSchema.js'
import Room from '../models/roomSchema.js'
import transport from '../services/mailService.js'

export const getAllBookings = async (req,res)=>{
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        const allBookings = await Booking.find({})
        .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
        .sort({customer:1}) 
        .skip((page-1)*perPage)//salto la pagina precedente
        .limit(perPage)
        const totalResults = await Booking.countDocuments()// mi da il numero totale di documenti
        const totalPages = Math.ceil(totalResults / perPage )  
        res.send({
            dati: allBookings,
            totalResults,
            totalPages,
            page,

        })
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }  
}

export const getSingleBooking = async (req,res)=>{
    const {id} =req.params
    try {
        const booking = await Booking.findById(id)
        res.status(200).send(booking) 
    } catch (error) {
        res.status(404).send({message: 'Not Found'}) 
    } 
}

export const addBooking = async (req,res)=>{
   
    // const booking = new Booking (req.body)
    // const room = new Booking (req.body)
    // const checkInDate =new Booking (req.body)
    // const checkOutDate =new Booking (req.body)
    const {customer, room, checkInDate, checkOutDate, status, pax} = req.body
    let newBooking
    try {
        const roomData = await Room.findById(room)
        if (!roomData) {
            return res.status(400).send({message: 'Room not Found'})
        }
        const pricePerNight =roomData.price;
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const numberOfNight= Math.ceil((checkOut-checkIn) / (1000 * 60 * 60 *24))
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

export const editBooking = async (req,res)=>{
    const {id} =req.params
    try {
        const booking = await Booking.findByIdAndUpdate(id, req.body, {new:true}) //new serve per restituire in author l'oggetto appena inserito, altrimenti non lo restituisce
        await booking.save();
      
        res.status(200).send(booking)
    } catch (error) {
        res.status(400).send(error)
    }
    
}
//TENTATIVO FALLITO DI INVIARE LA MAIL CON LA MODIFICA DELLA PRENOTAZIONE
// export const editBooking = async (req,res)=>{
//     const {id} =req.params
//     try {
//         let booking = await Booking.findByIdAndUpdate(id)
        
//         if(!booking) {
//             return res.status(404).send({message: 'Booking not found'})
//         }

//         booking = Object.assign(booking, req.body)//aggiorno i campi della prenetazione con i nuovi dati
//         if (req.body.checkInDate || req.body.checkOutDate || req.body.room){
//             const roomData = await Room.findById(booking.room);
//             if (!roomData) {
//                 return res.status(400).send({ message: 'Room not found' });
//             }
//         }
        
//         const pricePerNight = roomData.price;
//         const checkInDate =new Date(booking.checkInDate)
//         const checkOutDate = new Date(booking.checkOutDate)
//         const numberOfNights = Math.ceil((checkOutDate- checkInDate) / (1000 * 60 * 60 * 24));
        
//         booking.totalPrice = pricePerNight * numberOfNights;

//         await booking.save();
        
//         try {
//             const customer = await Customer.findById(booking.customer);
//             await transport.sendMail({
//                 from: 'noreply@epicoders.com',
//                 to: customer.email,
//                 subject: "Booking Updated",
//                 text: `Dear ${customer.name}, Your reservation has been updated. Here's the new details: Check in from ${checkInDate.toLocaleDateString('en-GB')} to ${checkOutDate.toLocaleDateString('en-GB')}, total price: ${booking.totalPrice}€.`,
//                 html: `<b>Dear ${customer.name}, <br> Your reservation has been updated. Here's the new details: Check in from ${checkInDate.toLocaleDateString('en-GB')} to ${checkOutDate.toLocaleDateString('en-GB')}, total price: ${booking.totalPrice}€.<b>`
//             })
//         } catch (emailError) {
//             console.error('Error sending email:', emailError);
//         }
      
//         res.status(200).send(booking)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// }

export const deleteBooking = async (req,res)=>{
    const {id} =req.params
    try {
        //se l'id esiste nello schema allora fai la delete
        if (await Booking.exists({_id:id})){
            await Booking.findByIdAndDelete(id)
            res.status(200).send(`ho eliminato la prenotazione con id: ${id}`)
        }else {res.status(404).send({message: `ID ${id} not found`})}
        
    } catch (error) {
        res.status(404).send({message: `ID ${id} not found`})
    }
}