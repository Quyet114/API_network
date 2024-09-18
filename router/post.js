const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const authenticateUser = require('../controller/middleware/authenticateUser ')
// Create a new post
router.post('/posts',authenticateUser, postController.createPost);

// Update a post
router.put('/posts/:id',authenticateUser, postController.updatePost);

// Delete a post (change status to hidden)
router.delete('/posts/:id',authenticateUser, postController.deletePost);

// Get all posts
router.get('/posts',postController.getAllPosts);

// Get posts by category
router.get('/category/:categoryId', postController.getPostsByCategory);

// Get posts by user like 
router.get('/likes/:userId',authenticateUser, postController.getPostsByLikes);

// Get posts by user read 
router.get('/reads/:userId',authenticateUser, postController.getPostsByReads);

// Update read count
router.post('/updateReadCount', postController.updateReadCount);

// Update like list
router.post('/updatelike',authenticateUser, postController.updateLikes);

// Update unLike list
router.post('/updateunlike',authenticateUser,postController.updateUnLikes);
// Get posts by like count
router.get('/most-liked', postController.getPostsByLikesCount);

// Get posts by read count
router.get('/most-read', postController.getPostsByReadCount);

// Get posts created today
router.get('/today', postController.getPostsCreatedThisWeek);
// get posts today by category
router.get('/categorytoday/:categoryId', postController.getPostsCreatedTodayByCategory);
// get 10 posts  by category
router.get('/tenreadcategory/:categoryId', postController.getTenReadPostsByCategory);
// find post by keywords
router.get('/find/search', postController.searchPostByKeywords);

// Route lấy danh sách post theo user
router.get('/getposybyuser/:userId',authenticateUser, postController.getPostsByUser);

// Route lấy danh sách post hôm nay của user
router.get('/getpostbyusertoday/:userId',authenticateUser, postController.getPostsTodayByUser);
module.exports = router;
