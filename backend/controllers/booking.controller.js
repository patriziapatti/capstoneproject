import Booking from '../models/bookingSchema.js'
import Customer from '../models/customerSchema.js'
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
   
    const booking = new Booking (req.body)
    let newBooking
    try {
         //salva i dati prendendoli nel db , prendendoli dall'istanza
        newBooking = await booking.save()
        //invia i dati al database
        res.status(200).send(newBooking)
    } catch (error) {
       return res.status(400).send(error)
    }  
    try {
        const customer = await Customer.findById(newBooking.customer)
        await transport.sendMail({
            from: 'noreply@epicoders.com', // sender address
            to: customer.email, // list of receivers
            subject: "New Booking", // Subject line
            text: `Your Reservation from ${booking.checkInDate} to ${booking.checkOutDate} is confirmed!`, // plain text body
            html: `Your Reservation from ${booking.checkInDate} to ${booking.checkOutDate} is confirmed!` // html body
        })
    } catch (error) {
        console.log(error)
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