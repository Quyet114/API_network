const express = require('express');
const router = express.Router();
const musicController = require('../controller/musicController');
// Route để tạo nhạc mới
router.post('/new', musicController.createNewMusic);
// Route để lấy tất cả nhạc
router.get('/all', musicController.getAllMusic);
// Route để tìm kiếm nhạc theo tên
router.get('/searchmusic/search', musicController.searchMusicName);

module.exports = router