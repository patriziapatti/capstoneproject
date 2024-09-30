import Customer from '../models/customerSchema.js'
import Booking from '../models/bookingSchema.js'

export const getAllCustomer = async (req, res) => {
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 5;
    perPage = perPage > 10 ? 5 : perPage;

    const name = req.query.name; // Prendi il parametro 'name' dalla query string

    // Crea una query dinamica basata sul valore di 'name'
    const query = name
        ? { $or: [{ name: { $regex: name, $options: 'i' } }, { surname: { $regex: name, $options: 'i' } }] }
        : {}; // Se 'name' è definito, cerca sia in 'name' che in 'surname', ignorando maiuscole/minuscole

    try {
        const allCustomer = await Customer.find(query)
            .collation({ locale: 'it' }) // Ignora maiuscole/minuscole nell'ordine alfabetico del sort
            .sort({ surname: 1 })
            .skip((page - 1) * perPage) // Salta la pagina precedente
            .limit(perPage);

        const totalResults = await Customer.countDocuments(query); // Conta solo i risultati filtrati
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: allCustomer,
            totalResults,
            totalPages,
            page,
        });
    } catch (error) {
        res.status(404).send({ message: 'Not Found' });
    }
};

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

// Endpoint per cercare clienti per nome, cognome o email
export const searchCustomer = async (req, res) => {
    const { query } = req.query; // recupera il parametro "query" dalla URL

    try {
        const customers = await Customer.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },     // Ricerca per nome
                { surname: { $regex: query, $options: 'i' } },  // Ricerca per cognome
                { email: { $regex: query, $options: 'i' } }     // Ricerca per email
            ]
        });

        if (customers.length > 0) {
            res.status(200).json(customers); // Ritorna i clienti trovati
        } else {
            res.status(404).json({ message: 'Cliente non trovato' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Errore nel server', error });
    }
};