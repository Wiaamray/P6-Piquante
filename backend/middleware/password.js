//importation de password-validator
const {
    Schema
} = require("mongoose");
const passwordValidator = require("password-validator");
//Création du schéma
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(5) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 5 caractères, 2 chiffres, une majuscule et une minuscule' });

    }
}