//Connexion to Database
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
//const db = process.env.DB_NAME
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.4afo4xn.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !', err));

mongoose.set('strictQuery', false);
    module.exports = {mongoose};