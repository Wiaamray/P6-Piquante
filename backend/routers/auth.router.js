//Routes d'autentification 
//Après recevoir nouveau requête fabriquer new user
const {
    createUser,
    logUser
} = require("../controllers/users")
const express = require("express")
const authRouter = express.Router()
//Importation des middlewares
const controleEmail = require("../middleware/controleEmail")
const password = require("../middleware/password")
authRouter.post("/signup", controleEmail, password, createUser)

authRouter.post("/login", logUser)
module.exports = {
    authRouter
}