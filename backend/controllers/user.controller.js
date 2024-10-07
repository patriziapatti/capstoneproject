import User from '../models/userSchema.js'
import transport from '../services/mailService.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req,res)=>{
    const page = req.query.page || 1
    let perPage = req.query.perPage || 9
    perPage = perPage > 10 ? 9 : perPage
    try {
        const allUsers = await User.find({})
        .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
        .sort({username:1}) 
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

// export const addUser = async (req,res)=>{
//     //crea un nuova istanza del modello user con i dati definiti nella parentesi tonde (prendendoli dal body)
//     // console.log(req.body)
//     const user = new User (req.body)
//     try {
//          //salva i dati prendendoli nel db , prendendoli dall'istanza
//         const newUser = await user.save()

//         //invia email accesso e password all'utente creato
//         await transport.sendMail({
//             from: 'noreply@epicoders.com',
//             to: newUser.email,
//             subject: 'Welcome to PMS',
//             text: `Dear ${newUser.name}, Welcome to PMS! Here's your username and password to login:  ${newUser.username} / ${newUser.password}`,
//             html: `Dear ${newUser.name},<br> Welcome to PMS! Here's your username and password to login:  ${newUser.username} / ${newUser.password}`,
//         })
//         //invia i dati al database
//         res.status(200).send(newUser)
//     } catch (error) {
//         res.status(400).send(error)
//     }  
// }

export const addUser = async (req, res) => {
    try {

        const plainPassword = req.body.password;
        // Hash della password prima di creare l'utente
        const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 è il numero di salti per la crittografia
        
        // Creiamo un nuovo utente con la password hashata
        const user = new User({
            ...req.body, // Copia tutte le altre proprietà
            password: hashedPassword // Sostituisci la password con quella hashata
        });

        // Salva l'utente nel database
        const newUser = await user.save();

        // Invia email con username e password 
        // await transport.sendMail({
        //     from: 'noreply@epicoders.com',
        //     to: newUser.email,
        //     subject: 'Welcome to PMS',
        //     text: `Dear ${newUser.name}, Welcome to PMS! Here's your username and password to login:  ${newUser.username} / ${plainPassword}`,
        //     html: `Dear ${newUser.name}, Welcome to PMS! Here's your username and password to login:  ${newUser.username} / ${plainPassword}`,
        // });

        // Rispondi con i dati dell'utente creato
        res.status(200).send(newUser);
    } catch (error) {
        res.status(400).send(error);
    }
};

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