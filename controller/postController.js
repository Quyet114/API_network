const { Post } = require('../models/Post');

const postController = {
    // Create a new post
    async createPost(req, res) {
        try {
            const { creator, text, images, type,tags } = req.body;
            const post = new Post({creator, text, images, type,tags });
            await post.save();
            res.status(201).json(post);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Get all posts
    async getAllPosts(req, res) {
        try {
            const posts = await Post.find();
            res.json(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Get a specific post by ID
    async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(post);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Update a post
    async updatePost(req, res) {
        try {
            const { creator, text, images, type } = req.body;
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                { creator, text, images, type },
                { new: true }
            );
            if (!updatedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(updatedPost);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Delete a post
    async deletePost(req, res) {
        try {
            const deletedPost = await Post.findByIdAndDelete(req.params.id);
            if (!deletedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json({ message: 'Post deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = postController;
