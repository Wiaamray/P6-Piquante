

// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require('mongoose');


// On rajoute ce validateur comme plugin
const uniqueValidator = require('mongoose-unique-validator'); // package qui valide l'unicité de l'email

//Désinfectant pour les modèles de mongoose.
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

// la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in,
// s'assurera que deux utilisateurs ne peuvent partager la même adresse e-mail.
// Utilisation d'une expression régulière pour valider le format d'email.
// Le mot de passe fera l'objet d'une validation particulière grâce au middleware verifPasword et au model password
//mongoose unique validator 


const userSchema = new mongoose.Schema({
    // L'email doit être unique
    email: {
        type: String,
        required: [true, "Veuillez entrer votre adresse email"],
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
    }, //mongo unique shéma
    password: {
        type: String,
        required: [true, "Veuillez choisir un mot de passe"]
    }
})


// Plugin pour garantir un email unique
// On applique ce validateur au schéma avant d'en faire un modèle et on appelle la méthode plugin et on lui passe uniqueValidator
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema)


// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
// On utilise le HTML Sanitizer de Google Caja pour effectuer cette désinfection.
userSchema.plugin(sanitizerPlugin);

// On exporte ce schéma sous forme de modèle : le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model('User', userSchema);

