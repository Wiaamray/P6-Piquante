
// Import mongoose
const mongoose = require("mongoose")

const sanitizerPlugin = require('mongoose-sanitizer-plugin');

// Appel le middleware de validation des champs du model de la sauce
//const sauceValidation = require('../middleware/sauceValidation');

// Création d'un schema mangoose pour que les données de la base MongoDB ne puissent pas différer de

//Schéma de donnée sauces
const saucesSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: {
        type: Number,
        min: 1,
        max: 10
    },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const sauces = mongoose.model("sauces", saucesSchema)

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
// Utilise le HTML Sanitizer  pour effectuer la désinfection.
saucesSchema.plugin(sanitizerPlugin);

// On exporte ce shéma de données, on va donc pouvoir utiliser ce modèle pour intéragir avec l'application
module.exports = mongoose.model('Sauces', saucesSchema);