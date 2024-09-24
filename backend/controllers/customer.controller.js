import Customer from '../models/customerSchema.js'
import Booking from '../models/bookingSchema.js'

export const getAllCustomer = async (req,res)=>{
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        const allCustomer = await Customer.find({})
        .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
        .sort({surname:1}) 
        .skip((page-1)*perPage)//salto la pagina precedente
        .limit(perPage)
        const totalResults = await Customer.countDocuments()// mi da il numero totale di documenti
        const totalPages = Math.ceil(totalResults / perPage )  
        // res.send(allAuthors)
        res.send({
            dati: allCustomer,
            totalResults,
            totalPages,
            page,

        })
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }  
}

export const getSingleCustomer = async (req,res)=>{
    const {id} =req.params
    try {
        const customer = await Customer.findById(id)
        res.status(200).send(customer) 
    } catch (error) {
        res.status(404).send({message: 'Not Found'}) 
    } 
}

export const addCustomer = async (req,res)=>{
    //crea un nuova istanza del modello user con i dati definiti nella parentesi tonde (prendendoli dal body)
    // console.log(req.body)
    const customer = new Customer (req.body)
    try {
         //salva i dati prendendoli nel db , prendendoli dall'istanza
        const newCustomer = await customer.save()
        //invia i dati al database
        res.status(200).send(newCustomer)
    } catch (error) {
        res.status(400).send(error)
    }  
}

export const editCustomer = async (req,res)=>{
    const {id} =req.params
    try {
        const customer = await Customer.findByIdAndUpdate(id, req.body, {new:true}) //new serve per restituire in author l'oggetto appena inserito, altrimenti non lo restituisce
        await customer.save();
        // res.send(`sono la put e modifico l'autore con id ${id}`)
        res.status(200).send(customer)
    } catch (error) {
        res.status(400).send(error)
    }
    
}


export const deleteCustomer = async (req,res)=>{
    const {id} = req.params
    try {
        //verifico se il cliente esiste
        const customerExists = await Customer.exists({_id: id})
        if (!customerExists){
            return res.status(404).send({message: `ID ${id} not found`})
        }

        //verifico se ci sono prenotazioni associate a questo customer
        const bookings = await Booking.find({customer: id})
        if (bookings.length > 0){
            return res.status(400).send({ message: `Il cliente con ID ${id} ha prenotazioni attive e non può essere eliminato.`});
        }
        await Customer.findByIdAndDelete(id)
        res.status(200).send(`ho eliminato il cliente con id: ${id}`)
    } catch (error) {
        res.status(500).send({ message: `Errore del server durante l'eliminazione del cliente: ${error.message}` });
    }
}
