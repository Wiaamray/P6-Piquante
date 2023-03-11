const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const User = require("../models/userSchema");

function authentificationuser(req, res, next) {
//Récupérer le header
// Condition si ya pas un token
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({
        message: "token absent"
    })
    
    //la fonction split pour tout récupérer après l'espace dans le header.
    const token = header.split(' ')[1]
    if (token == null) return res.status(403).send({
        message: "Token ne peut pas être nul"
    })

    //vérifier le token
    //La fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
    jwt.verify(token, process.env.JWT_PASSWORD, async (err, decod) => {
        if (err) return res.status(403).send({
            message: "Token invalide :" + err
        })

        const user = await User.findOne({
            email: decod.email
        });
        if (!user) return res.status(403).send({
            message: "Utilisateur non trouvé"
        });

        req.body.userId = user.id;
        next()
    })
}
module.exports = {
    authentificationuser
};