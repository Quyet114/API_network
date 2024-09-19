const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudname = process.env.CLOUD_NAME;
const apikey = process.env.API_KEY;
const apisecret = process.env.API_SECRET;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: cloudname,
    api_key: apikey,
    api_secret: apisecret
});

// Tạo bộ lưu trữ trên Cloudinary chỉ cho file MP3
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "music",       
        resource_type: 'auto',  
        allowed_formats: ['mp3']
    }
});

const uploadMp3Cloud = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /audio\/mpeg/;  // Sử dụng audio/mpeg cho MP3
        const mimetype = filetypes.test(file.mimetype);  // Kiểm tra mimetype
        const extname = /mp3/.test(file.originalname.toLowerCase());  // Kiểm tra phần mở rộng file
    
        if (mimetype && extname) {
          return cb(null, true);  // File hợp lệ
        } else {
          cb(new Error('Invalid file type. Only MP3 files are allowed.'));  // Báo lỗi nếu không phải file MP3
        }
      }
});

module.exports = uploadMp3Cloud;
