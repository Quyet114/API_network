const mediaController = require('../controller/mediaController');
const route = require("express").Router();
const uploadCloud = require('../controller/middleware/cloudinaryUploadMedia');

// Route for uploading images and videos
route.post("/upload", uploadCloud.any(), mediaController.uploadMedia);

module.exports = route;
