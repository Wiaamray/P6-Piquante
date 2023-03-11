
// Requires 
const express = require('express');
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const mongo = require('./mongo');


// Routes
const {
    saucesRouter: saucesRouter
} = require("./routers/sauces.router")
const {
    authRouter
} = require("./routers/auth.router")
const {
    imagesRouter
} = require("./routers/images.router");


// Démarrer l'application Express
const app = express();


/** 
//Installation package multer
const multer = require("multer")
//Controllers
const {
    createUser,
    logUser
} = require("./controllers/users")
const {
    getSauces,
    createSauces,
    getImage
} = require("./controllers/sauces")
const {
    authentificationuser
} = require("./middleware/auth")
**/

/********Security Requires********/
//middleware pour nettoyer les entrées utilisateur provenant du corps POST, des requêtes GET et des paramètres d'URL.
// Data Sanitization against XSS
const xss = require('xss-clean');
//Helmet vous aide à sécuriser vos applications Express en définissant divers en-têtes HTTP
// Add 14 middleware to prevent few attacks
const helmet = require('helmet');
//Nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB.
// Data Sanitization against NoSQL Injection Attacks
const mongoSanitize = require('express-mongo-sanitize');
//Ce middleware Express définit certains en-têtes de réponse HTTP pour tenter de désactiver la mise en cache côté client.
const nocache = require('nocache');
const session = require('express-session');


//Middlewars cors contre les requête malveillante
app.use((req, res, next) => {
    //Access-Control-Allow-Origin: * ce qui signifie que la ressource peut être demandée par n'importe quel domaine. 
    res.setHeader('Access-Control-Allow-Origin', '*');
    //qui confirme que les en-têtes souhaités sont autorisés pour la requête principale.
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Access-Control-Allow-Methods et indique que les méthodes POST et GET sont acceptables pour manipuler la ressource visée. 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


/* Options de sécurisation des cookies */
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:3000',
            expires: expiryDate
          }
  })
);

//Middleware
app.use(express.json());
//Transformer le corps (le body) en json objet javascript utilisable
// app.use(bodyParser.json())

// Helmet
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             imgSrc: ["'self'"],
//         },
//     })
// );

const corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));

// Data Sanitization contre les attaques XSS
app.use(xss());

//Data Sanitization contre les attaques par injection NoSQL
app.use(mongoSanitize());

/* Désactive la mise en cache du navigateur */
// app.use(nocache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Paramétrage des routes
app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)
app.use("/images", imagesRouter)
app.get("/", (req, res) => res.send("Hello World"))
app.use((req, res, next) => {
    res.status(404).send({
        message: 'Route not found !'
    });
    next();
});


module.exports = app ;
