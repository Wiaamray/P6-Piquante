const express = require("express");
const {
    getImage
} = require("../controllers/images");
const imagesRouter = express.Router()
imagesRouter.get("/:filename", getImage)
module.exports = {
    imagesRouter
}