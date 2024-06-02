const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

// Route for creating a new post
router.post('/posts', postController.createPost);

// Route for getting all posts
router.get('/posts', postController.getAllPosts);

// Route for getting a specific post by ID
router.get('/posts/:id', postController.getPostById);

// Route for updating a post by ID
router.put('/posts/:id', postController.updatePost);

// Route for deleting a post by ID
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
