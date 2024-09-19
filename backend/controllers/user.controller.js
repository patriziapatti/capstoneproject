import User from '../models/userSchema.js'

export const getAllUsers = async (req,res)=>{
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        const allUsers = await User.find({})
        .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
        .sort({name:1, surname:1}) 
        .skip((page-1)*perPage)//salto la pagina precedente
        .limit(perPage)
        const totalResults = await User.countDocuments()// mi da il numero totale di documenti
        const totalPages = Math.ceil(totalResults / perPage )  
        // res.send(allAuthors)
        res.send({
            dati: allUsers,
            totalResults,
            totalPages,
            page,

        })
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }  
}

export const getSingleUser = async (req,res)=>{
    const {id} =req.params
    try {
        const user = await User.findById(id)
        res.status(200).send(user) 
    } catch (error) {
        res.status(404).send({message: 'Not Found'}) 
    } 
}

export const addUser = async (req,res)=>{
    //crea un nuova istanza del modello user con i dati definiti nella parentesi tonde (prendendoli dal body)
    // console.log(req.body)
    const user = new User (req.body)
    try {
         //salva i dati prendendoli nel db , prendendoli dall'istanza
        const newUser = await user.save()
        //invia i dati al database
        res.status(200).send(newUser)
    } catch (error) {
        res.status(400).send(error)
    }  
}

export const editUser = async (req,res)=>{
    const {id} =req.params
    try {
        const user = await User.findByIdAndUpdate(id, req.body, {new:true}) //new serve per restituire in author l'oggetto appena inserito, altrimenti non lo restituisce
        await user.save();
        // res.send(`sono la put e modifico l'autore con id ${id}`)
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
    
}

export const deleteUser = async (req,res)=>{
    const {id} =req.params
    try {
        //se l'id esiste nello schema allora fai la delete
        if (await User.exists({_id:id})){
            await User.findByIdAndDelete(id)
            res.status(200).send(`ho eliminato l'utente con id: ${id}`)
        }else {res.status(404).send({message: `ID ${id} not found`})}
        
    } catch (error) {
        res.status(404).send({message: `ID ${id} not found`})
    }
}