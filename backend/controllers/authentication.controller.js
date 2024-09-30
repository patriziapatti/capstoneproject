import User from '../models/userSchema.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import { token } from 'morgan';


export const register = async (req,res) =>{
    //verificare che la mail non sia già utilizzata
    const user = await User.findOne({email: req.body.email});
    //se esiste ritorna errore
    if (user) return res.status(500).send('Email already exists')
    // se non è usata allora salviamo il nuovo utente con la password hashata
    const newUser= new User({
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        verifiedAt: new Date()
    });

    const userCreated = await newUser.save()
    res.send(userCreated);
}

// export const login = async (req,res) => {
//     //cercare la mail nel db
//     const user = await User.findOne({email: req.body.email}).select('+password')//la select mi fa prendere tutto più il campo password
//     //se non trova la mail
//     if(!user) return res.status(401).send('Incorrect Credentials')
//     //se trova la mail
//     if(!(await bcrypt.compare(req.body.password, user.password))){
//         return res.status(401).send('Incorrect Credentials')
//     }
//     //se la password è corretta allora generare il jwt e lo restituiamo
//     jwt.sign(
//         {userId: user.id},
//         process.env.JWT_SECRET,
//         {
//             expiresIn: '8h'
//         },
//         (err, jwtToken) =>{
//             if (err) return res.status(500).send();
//             return res.send({
//                 token: jwtToken
//             })
//         }
//     )
// }

export const login = async (req, res) => {
    try {
        // Cerca l'utente con l'email fornita, inclusa la password
        const user = await User.findOne({ email: req.body.email }).select('+password');
        
        // Se l'utente non esiste
        if (!user) {
            return res.status(401).send('Incorrect Credentials');
        }

        // Confronta la password inserita dall'utente con quella hashata nel database
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Incorrect Credentials');
        }

        // Se la password è corretta, genera il JWT
        jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, jwtToken) => {
                if (err) return res.status(500).send();
                return res.send({ token: jwtToken });
            }
        );
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const changePassword = async (req, res) =>{
    try {
        // 1. Recupera l'utente loggato dal middleware di autenticazione
    const user = req.loggedUser;

    // 2. Recupera la password corrente e la nuova password dal body della richiesta
    const { currentPassword, newPassword } = req.body;

    // 3. Verifica che la password corrente e la nuova password siano fornite
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Password corrente e nuova password sono richieste.' });
    }

    // 4. Verifica se la password corrente fornita corrisponde a quella salvata
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La password corrente non è corretta.' });
    }
    // 5. Genera un hash della nuova password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 6. Aggiorna la password dell'utente nel database
    user.password = hashedPassword;
    await user.save();

    // 7. Rispondi con un messaggio di successo
    res.status(200).json({ message: 'Password aggiornata con successo.' });

    } catch (error) {
        res.status(500).json({ message: 'Errore durante l\'aggiornamento della password.', error: error.message });
    }
}

export const me = async(req,res) =>{
    return res.send(req.loggedUser)
}