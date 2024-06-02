
//----------------------
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dyjxyz2jc',
    api_key: '638458188483596',
    api_secret: 'pjxLRPBCzL1nJU1_NIoQ4rXKlfg'
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'mp4'],
    params:{
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
