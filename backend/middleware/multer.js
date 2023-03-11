//importer le package multer
const multer = require("multer")


//configuration de multer , diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
//filename: expliquer à multer quel nom fichier
//la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
const storage = multer.diskStorage({
    destination: "images/",
    filename: function(req, file, cb) {
        cb(null, makeFilename(req, file))
    }
})
//la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now()
function makeFilename(req, file) {
    console.log("req, file:", file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")

    file.fileName = fileName
    return fileName
}
const upload = multer({
    storage
})
module.exports = {
    upload
}