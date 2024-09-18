const express = require('express');
const router = express.Router();
const commentController = require('../controller/cmtController');

// Tạo bình luận hoặc trả lời bình luận
router.post('/comments', commentController.createCmt);
router.get('/:postId/comments', commentController.getCmtByPost);
router.get('/:shortId/shortcomments', commentController.getCmtByShort);
module.exports = router;