const express = require("express")
const {
    getSauces,
    createSauces,
    getsaucesById,
    modifySauces,
    likeSauces, deleteSauces
} = require("../controllers/sauces")
const {
    upload
} = require("../middleware/multer")
const {authentificationuser} = require("../middleware/auth");
const saucesRouter = express.Router()
saucesRouter.use(authentificationuser)
saucesRouter.get("/", getSauces)

// /:id Afficher uniquement un objet sélectionné par son _id
//Mettre l'image sur notre serveur

//Vous créerez une API pour Créer, Lire, Mettre à jour et Supprimer (CRUD pour l’anglais
//Create, Read, Update and Delete) 
/**POST (Publier), GET (Obtenir), Update (Mettre à jour) PUT (Mettre), Delete (Supprimer)

DELETE (Supprimer)**/

// Routes
saucesRouter.post("/", upload.single("image"), createSauces)
saucesRouter.get("/:id", getsaucesById)
saucesRouter.delete("/:id", deleteSauces)
saucesRouter.put("/:id", upload.single("image"), modifySauces)
saucesRouter.post("/:id/like", likeSauces)
module.exports = {
    saucesRouter: saucesRouter
}