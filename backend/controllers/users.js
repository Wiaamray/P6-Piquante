
// Requires
const User = require('../models/userSchema');
const {
    mongo, mongoose
} = require("../mongo")
const dotenv = require("dotenv")
//librairie de hashage password
const bcrypt = require("bcrypt")
//Librairie JWT Token
const jwt = require("jsonwebtoken")
const validator = require("validator");
const passwordValidator = require("password-validator");
const session = require("express-session");
// const mongoose = require("mongoose");


//Fonction de création d'un nouveau utilisateur
async function createUser(req, res) {
  try {
      const {
          email,
          password
      } = req.body
      const password_hash = await hashPassword(password)
      const user = new User({
          email,
          password: password_hash
      })
      console.log('trying to save', user);
      //save() qui enregistre simplement user dans la base de données.
      await user.save()
      res.status(201).send({
          message: "Utilisateur enregistré ! :"
      })
  } catch (err) {
      console.log('err createUser', err);
      res.status(409).send({
          message: "Utilisateur n'est pas enregistré :" + err
      })
  }
}
//Fonction pour hashage de password 
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds)
}
//Fonction login  user
async function logUser(req, res) {
  try {
      //logUser va récupérer email et le password
      const email = req.body.email
      const password = req.body.password
      //Trouver utilisateur dans la base de donnée
      const user = await User.findOne({
          email: email
      })
      //Controlé la validité de password envoyé par le front
      // la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données.
      const ispasswordValide = await bcrypt.compare(password, user.password)
      //Si le password est incorrect
      if (!ispasswordValide) {
         return  res.status(403).send({
              message: " Mot de passe incorrect "
          })
      }
      //Créer un web token
      const token = createToken(email)
      res.status(200).send({
          userId: user?._id,
          token: token
      })
 //message d'erreur si le problème de connexion à la base donnée
  } catch (err) {
      res.status(500).send({
          message: " Erreur interne "
      })
  }
}
//pour supprimer  ma base de donnés
//User.deleteMany({}).then(() => console.log("all removed"))
//Fonction de création d'un webtoken
function createToken(email) {
  //la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
  const jwtpassword = process.env.JWT_PASSWORD
  return jwt.sign({
      email: email
  }, jwtpassword, {
      expiresIn: "24h"
  })
}
module.exports = {
  createUser,
  logUser
}