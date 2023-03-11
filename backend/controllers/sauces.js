
// Requires
const Sauce = require('../models/sauceSchema');
const fs = require("fs");
const bcrypt = require("bcrypt")
const {
    get
} = require("https");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const path = require("path");



//Schéma de donnée sauces
/**const saucesSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: {
        type: Number,
        min: 1,
        max: 5
    },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const sauces = mongoose.model("sauces", saucesSchema)**/




//Fonction récupérer les sauces 
async function getSauces(req, res) {

    try {
        const results = await Sauce.find();
        res.status(200).send(results);
    } catch (error) {
        console.log("PROBLEM GETTING SAUCES", error);
        res.status(500).send(error);
    }
}
//Trouver la sauce par ID
//req (request) res (reponse)
//une fonction ne sert à rien 
function getsauce(req, res) {
    const {
        id
    } = req.params
    return Sauce.findById(id)
}
//Trouver la sauce par ID
async function getsaucesById(req, res) {
    
    try {
        const result = await getsauce(req, res);
        res.status(200).send(result);
    } catch (e) {
      
        res.status(500).send(err)
    }
}


//Fonction pour supprimer la sauce
async function deleteSauces(req, res) {
    const {
        id
    } = req.params;
    try {
         //verifier si l'utilisateur propriétaire de la sauce
        const oldSauce = await Sauce.findById(id);
        console.log('delete', oldSauce.userId, req.body)
        // Vériviier si l'utilisateur propriétaire de la sauce
        if(oldSauce.userId !== req.body?.userId) {
            return res.status(401).json({ error: 'Vous n\'êtes pas autorisé à modifier cette sauce' });
        }
        await Sauce.findByIdAndDelete(id);
        await deleteImage(oldSauce);
       
        res.status(200).send({
            message: 'Supprimé avec succès'
        });
    } catch (err) {
        console.error("PROBLEM UPDATING", err);
        res.status(404).send({
            message: 'Impossible de supprimer cette sauce pour le moment'
        });
    }
}
//Fonction de modification de sauce
async function modifySauces(req, res) {
    const {
        params: {
            id
        }
    } = req
    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)
    try {
        const oldSauce = await Sauce.findById(id);
        // Vériviier si l'utilisateur propriétaire de la sauce
        if(oldSauce.userId !== req.body?.userId) {
            return res.status(401).json({ error: 'Vous n\'êtes pas autorisé à modifier cette sauce' });
        }
        const result = await Sauce.findByIdAndUpdate(id, payload);
    
        if (hasNewImage) {
            await deleteImage(oldSauce);
        }
        res.status(200).send(result);
    } catch (err) {
       
        res.status(404).send({
            message: 'Impossible de modifier la sauce pour le moment'
        });
    }
}
//supprimer les images de local et de la base de donnée        
// process.cwd() pour obtenir le répertoire de travail actuel du processus 
// path.basename  La méthode path.basename() renvoie la partie nom de fichier d'un chemin de fichier
//La méthode unlink() du package  fs (file système)  vous permet de supprimer un fichier du système de fichiers.
function deleteImage(sauces) {
    if (sauces == null) return
 
    //Récupérer l'imgage URl (nom du fichier)
    const imageToDelete = path.basename(sauces.imageUrl);
    const image_path = `${process.cwd()}/images/${imageToDelete}`;
    return fs.promises.unlink(image_path);
}

function makePayload(hasNewImage, req) {

    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
 
    return payload
}

function sendClientResponse(sauces, res) {
    if (sauces == null) {
  
        return res.status(404).send({
            message: "Object not found in database"
        })
    }

    return Promise.resolve(res.status(200).send(sauces)).then(() => sauces)
}
//pour reconstruire l'URL complète du fichier enregistré.
function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
}
async function createSauces(req, res) {
    try {
     
        const {
            body,
            file
        } = req
        const {
            fileName
        } = file
        const sauce = JSON.parse(body.sauce)
        const {
            name,
            manufacturer,
            description,
            mainPepper,
            heat,
            userId
        } = sauce
      
        const newsauces = new Sauce({
            userId: userId,
            name: name,
            manufacturer: manufacturer,
            description: description,
            mainPepper: mainPepper,
            imageUrl: makeImageUrl(req, fileName),
            heat: heat,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        })
        const result = await Sauce.create(newsauces);
        res.status(200).send(result);
    } catch (err) {
    
        res.status(500).send((err));
    }
}
// chercher la sauce en question 
async function likeSauces(req, res) {
    let {
        like,
        userId
    } = req.body
    const {
        id
    } = req.params;
  
    //Condition (like === 0, -1, 1)
    //Méthode array include
    //Si cette array ne contient ni 0 , 1, -1
    try {
        like = Number(like);
        if (![0, -1, 1].includes(like)) {
            res.status(400).send({
                message: 'Valeur invalide du like'
            });
            return;
        }
        const sauce = await Sauce.findById(id);
        if (!sauce) {
            res.status(404).send({
                message: 'Sauce non trouvée'
            });
            return;
        }
        if (like > 0) {
            await incrementLike(sauce, userId);
        } else if (like < 0) {
            await incrementDislike(sauce, userId)
        } else {
            await resetLike(sauce, userId);
        }
        res.status(200).send({
            message: 'Opération réussie'
        });
    } catch (err) {
     
        res.status(500).send({
            message: 'Opération échouée!'
        });
    }
}
async function incrementLike(sauce, userId) {
    let {
        usersLiked,
        likes
    } = sauce;
    // si l'utilisateur à déja liké la sauce
    if (usersLiked.includes(userId)) return;
    //sinon on augmente le nombre de like
    usersLiked.push(userId);
    likes++;
    await Sauce.updateOne({
        _id: sauce._id
    }, {
        $set: {
            usersLiked,
            likes
        }
    });
}
async function incrementDislike(sauce, userId) {
    let {
        usersDisliked,
        dislikes
    } = sauce;
    // si l'utilisateur à déja disliké la sauce
    if (usersDisliked.includes(userId)) return;
    // sinon on augmente le nombre de dislike
    usersDisliked.push(userId);
    dislikes++;
    await Sauce.updateOne({
        _id: sauce._id
    }, {
        $set: {
            usersDisliked,
            dislikes
        }
    });
}
async function resetLike(sauce, userId) {
    let {
        usersLiked,
        likes,
        usersDisliked,
        dislikes
    } = sauce
    // si l'utilisateur à déja liké la sauce on le supprime de la liste
    if (usersLiked.includes(userId)) {
        //Enlever l'user de la base de donné
        usersLiked = usersLiked.filter((user) => user !== userId);
        likes--;
        //Update de userid et like
        await Sauce.updateOne({
            _id: sauce._id
        }, {
            $set: {
                usersLiked,
                likes
            }
        });
    }
    // si l'utilisateur à déja disliké la sauce on le supprime de la liste
    if (usersDisliked.includes(userId)) {
        usersDisliked = usersDisliked.filter((user) => user !== userId);
        dislikes--;
        await Sauce.updateOne({
            _id: sauce._id
        }, {
            $set: {
                usersDisliked,
                dislikes
            }
        });
    }
}

//Exporter pour rendre accessible au monde extérieur
module.exports = { 
    sendClientResponse,
    getSauces,
    createSauces,
    modifySauces,
    deleteSauces,
    getsaucesById,
    getsauce,
    likeSauces
}