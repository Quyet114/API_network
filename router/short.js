const express = require('express');
const router = express.Router();
const shortController = require('../controller/shortController');
const authenticateUser = require('../controller/middleware/authenticateUser ')

// Tạo mới một Short
router.post('/shorts', shortController.createShort);

// Xóa (ẩn) một Short
router.delete('/shorts/:id', authenticateUser, shortController.deleteShort);

// Lấy tất cả các Shorts
router.get('/shorts', shortController.getAllShorts);

// Cập nhật số lần đọc của một Short
router.put('/shortsread', shortController.updateReadCount);
// Lấy 10 Shorts với phân trang
router.get('/tenshorts', shortController.getTenShorts);
// Cập nhật danh sách thích (likes) của một Short
router.put('/shorts/likes', authenticateUser, shortController.updateLikes);
// Cập nhật danh sách thích (likes) của một Short
router.put('/shorts/deletelikes', authenticateUser, shortController.deleteLike);
// Cập nhật danh sách không thích (unlikes) của một Short
router.put('/shorts/unlikes', authenticateUser, shortController.updateUnLikes);

// Lấy tất cả các Shorts được tạo hôm nay
router.get('/shorts/today', shortController.getShortsCreatedToday);

module.exports = router;
