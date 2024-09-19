
//----------------------
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudname = process.env.CLOUD_NAME;
const apikey = process.env.API_KEY;
const apisecret = process.env.API_SECRET;
cloudinary.config({
    cloud_name: cloudname,
    api_key: apikey,
    api_secret: apisecret
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'mp4'],
    params: {
        folder: "demo1",
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'mp4']
    }
});
const uploadCloud = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|mp4/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only jpg, png, and mp4 files are allowed.'));
        }
    }
});

module.exports = uploadCloud;
