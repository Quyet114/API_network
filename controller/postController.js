const { Post } = require('../models/Post');
const { User } = require('../models/User');
const { Categories } = require('../models/Categories');
const mongoose = require('mongoose');
const { search } = require('../router/auth');
const postController = {
    // Create a new post
    async createPost(req, res) {
        try {
            const { creator, title, text, images, categories, type } = req.body;
            const post = new Post({
                creator,
                title: title || '',
                text: text || '',
                images: images || [],
                categories: categories || 0,
                type: type || 0
            });
            await post.save();
            const user = await User.findById(creator);
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }

            // Add the post to user's userPost array
            user.userPost.push(post._id);
            await user.save();
            res.status(201).json({ message: 'successfully', status: 1, post });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },

    // Update a post
    async updatePost(req, res) {
        try {
            const { text, title, images, categories } = req.body;
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    ...(title && { title }),
                    ...(text && { text }),
                    ...(images && { images }),
                    ...(categories && { categories }),
                },
                { new: true }
            );
            if (!updatedPost) {
                return res.status(404).json({ message: 'Post not found', status: -1 });
            }
            res.json({ message: 'successfully', status: 1, updatedPost });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },

    // Delete a post (change status to hidden)
    async deletePost(req, res) {
        try {
            const deletedPost = await Post.findByIdAndUpdate(
                req.params.id,
                { type: 1 },
                { new: true }
            );
            if (!deletedPost) {
                return res.status(404).json({ message: 'Post not found', status: -1 });
            }
            res.json({ message: 'Post hidden successfully', status: 1 });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },

    // Get all posts
    async getAllPosts(req, res) {
        try {
            const posts = await Post.find().populate('creator').populate('categories').populate('likes');;
            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },

    // Get posts by user like
    async getPostsByLikes(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .populate({
                    path: 'likeHistory',
                    model: 'Post',
                    populate: [{
                        path: 'creator',
                        model: 'User'
                    },
                    {
                        path: 'categories',
                        model: 'Categories'
                    }]
                });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'successfully', status: 1, user });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // get today post by user
    async getPostsTodayByUser(req, res) {
        const { userId } = req.params;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        try {
            const posts  = await Post.find({
                creator: userId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }

            })
                .populate({
                    path: 'userPost',
                    model: 'Post',
                    populate: [{
                        path: 'creator',
                        model: 'User'
                    },
                    {
                        path: 'categories',
                        model: 'Categories'
                    }]
                });
            if (!posts ) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'successfully', status: 1, posts  });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // get post by user
    async getPostsByUser(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .populate({
                    path: 'userPost',
                    model: 'Post',
                    populate: [{
                        path: 'creator',
                        model: 'User'
                    },
                    {
                        path: 'categories',
                        model: 'Categories'
                    }]
                });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'successfully', status: 1, user });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get posts by user read
    async getPostsByReads(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .populate({
                    path: 'readHistory',
                    model: 'Post',
                    populate: [{
                        path: 'creator',
                        model: 'User'
                    },
                    {
                        path: 'categories',
                        model: 'Categories'
                    }]
                });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'successfully', status: 1, user });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },

    // Update read count
    async updateReadCount(req, res) {
        try {
            const { postId, userId } = req.body;

            // Tìm bài viết theo postId
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found', status: -1 });
            }

            // Tăng số lượng đọc của bài viết
            post.reads += 1;
            if (userId) {
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found', status: -1 });
                }
                if (!user.readHistory.includes(postId)) {
                    user.readHistory.push(postId);
                    await user.save();
                }
            }

            // Lưu thay đổi trên bài viết
            await post.save();
            res.json({ message: 'successfully', status: 1 });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },


    // Update like list
    async updateLikes(req, res) {
        try {
            const { postId, userId } = req.body;
            console.log("postId:", postId);
            console.log("userId:", userId);
            const postObjectId = mongoose.Types.ObjectId(postId)
            const userObjectId = mongoose.Types.ObjectId(userId);

            const post = await Post.findById(postObjectId);
            const user = await User.findById(userObjectId);
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }
            if (!post) {
                return res.status(404).json({ message: 'Post not found', status: -1 });
            }


            if (!post.likes.includes(userId)) {
                post.likes.push(userId);
                if (!user.likeHistory.includes(postId)) {
                    user.likeHistory.push(postId);
                }
            }

            await post.save();
            await user.save();
            res.json({ message: 'successfully', status: 1 });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },
    // Update unLike list
    async updateUnLikes(req, res) {
        try {
            const { postId, userId } = req.body;
            const postObjectId = mongoose.Types.ObjectId(postId);
            const userObjectId = mongoose.Types.ObjectId(userId);
            const post = await Post.findById(postObjectId);
            const user = await User.findById(userObjectId);

            if (!post) {
                return res.status(404).json({ message: 'Post not found', status: -1 });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }

            // Tăng số lượng unLikes của post
            post.unLikes += 1;
            await post.save();

            // Xóa postId khỏi likeHistory của user
            user.likeHistory = user.likeHistory.filter(id => id.toString() !== postId);
            await user.save();

            res.json({ message: 'successfully', status: 1 });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },

    // Get posts by like count
    async getPostsByLikesCount(req, res) {
        try {
            const posts = await Post.find().sort({ likes: -1 }).populate('creator').populate('categories').populate('likes').sort({ createdAt: -1 });;
            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get posts by read count
    async getPostsByReadCount(req, res) {
        try {
            const posts = await Post.find()
            .sort({ reads: -1 })
            .populate('creator')
            .populate('categories')
            .populate('likes')
            .sort({ createdAt: -1 })
            .limit(10);;;
            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get posts created today
    async getPostsCreatedThisWeek(req, res) {
        try {
            const today = new Date();
            const sevenDaysAgo = new Date(today);

            // Lùi lại 7 ngày từ hôm nay
            sevenDaysAgo.setDate(today.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            const posts = await Post.find({ createdAt: { $gte: sevenDaysAgo } })
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .sort({ createdAt: -1 });

            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // get posts today by category
    async getPostsCreatedTodayByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const posts = await Post.find({
                categories: categoryId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            })
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },

    // Get posts by category
    async getPostsByCategory(req, res) {
        try {
            const posts = await Post.find({ categories: req.params.categoryId })
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },

    async getTenReadPostsByCategory(req, res) {
        try {
            const categoryId = req.params.categoryId;

            const posts = await Post.find({ categories: categoryId })
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .sort({ reads: -1 })
                .limit(10);

            res.json({ message: 'successfully', status: 1, posts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },

    async searchPostByKeywords(req, res) {
        try {
            const { keyword } = req.query;
            if (!keyword || keyword.trim() === '') {
                return res.status(400).json({ message: 'Keyword is required for searching users' });
            }
            const users = await Post.find({
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { text: { $regex: keyword, $options: 'i' } }
                ]
            })
            .select('title text') 
            .populate('creator', 'name avatar')
            .populate('categories', 'name');

            ;
            if (users.length > 0) {
                return res.status(200).json({ message: 'Users found successfully', data: users });
            } else {
                return res.status(404).json({ message: 'No users found with the given keyword' });
            }

        } catch (error) {
            console.log('Error in searchUserByKeyword:', error);
            return res.status(500).json({ message: 'An error occurred while searching for users', error: error.message });
        }
    }
};

module.exports = postController;
