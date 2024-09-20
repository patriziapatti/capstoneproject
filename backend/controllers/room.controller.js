import Room from '../models/roomSchema.js'

export const getAllRooms = async (req,res)=>{
    const page = req.query.page || 1
    let perPage = req.query.perPage || 5
    perPage = perPage > 10 ? 5 : perPage
    try {
        const allRooms = await Room.find({})
        .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
        .sort({type:1}) 
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
    const {id} =req.params
    try {
        //se l'id esiste nello schema allora fai la delete
        if (await Room.exists({_id:id})){
            await Room.findByIdAndDelete(id)
            res.status(200).send(`ho eliminato la camera con id: ${id}`)
        }else {res.status(404).send({message: `ID ${id} not found`})}
        
    } catch (error) {
        res.status(404).send({message: `ID ${id} not found`})
    }
}