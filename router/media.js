const mediaController = require('../controller/mediaController');

const route = require("express").Router();
const uploadCloud = require('../controller/middleware/cloudinaryUploadMedia');
const uploadMp3Cloud = require('../controller/middleware/cloudinaryUploadMp3')
// Route for uploading images and videos
route.post("/upload-medias", uploadCloud.any(), mediaController.uploadMedia);
route.post("/upload-mp3", uploadMp3Cloud.any(), mediaController.uploadMedia);
module.exports = route;
