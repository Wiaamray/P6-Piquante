//Requires
const fs = require('fs');
const mime = require('mime-types');


async function getImage(req, res) {
    try {
        const path = `${process.cwd()}/images/${req.params.filename}`;
        const image = await fs.promises.readFile(path);
        const contentType = mime.lookup(path);
        res.setHeader('Content-Type', contentType);
        return res.send(image);
    } catch (error) {
        console.log('error', error);
        res.status(404).send({
            message: 'Impossible d\'afficher l\'image'
        });
    }
}
module.exports = {
    getImage
}