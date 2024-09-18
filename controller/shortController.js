const { Short } = require('../models/Short');
const { User } = require('../models/User');
const { Categories } = require('../models/Categories');
const mongoose = require('mongoose');
const shortController = {
    // Create a new Short
    async createShort(req, res) {
        try {
            const { creator, title, text, images, categories, type, music } = req.body;
            const short = new Short({
                creator,
                title: title || '',
                text: text || '',
                images: images || [],
                categories: categories || 0,
                type: type || 0,
                music:music || '',
            });
            await short.save();
            res.status(201).json({ message: 'successfully', status: 1, short });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },
    // Delete a Short (change status to hidden)
    async deleteShort(req, res) {
        try {
            const deletedShort = await Short.findByIdAndUpdate(
                req.params.id,
                { type: 1 },
                { new: true }
            );
            if (!deletedShort) {
                return res.status(404).json({ message: 'Short not found', status: -1 });
            }
            res.json({ message: 'Short hidden successfully', status: 1 });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get all Shorts
    async getAllShorts(req, res) {
        try {
            const shorts = await Short.find().populate('creator').populate('categories').populate('likes').populate('music');;
            res.json({ message: 'successfully', status: 1, shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get Shorts with pagination
    async getTenShorts(req, res) {
        try {
            // Lấy số lượng mục và trang từ query params, mặc định lấy 10 mục đầu tiên
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            // Sử dụng limit và skip để phân trang
            const shorts = await Short.find()
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .populate('music')
                .limit(limit)
                .skip((page - 1) * limit);

            res.json({ message: 'successfully', status: 1, shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Update read count
    async updateReadCount(req, res) {
        try {
            const { shortId } = req.body;
            // Tìm bài viết theo ShortId
            const short = await Short.findById(shortId);
            if (!short) {
                return res.status(404).json({ message: 'Short not found', status: -1 });
            }
            // Tăng số lượng đọc của bài viết
            short.reads += 1;
            // Lưu thay đổi trên bài viết
            await short.save();
            res.json({ message: 'successfully', status: 1 });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },
    // Update like list
    async updateLikes(req, res) {
        try {
            const { shortId, userId } = req.body;
            const postObjectId = mongoose.Types.ObjectId(shortId)
            const userObjectId = mongoose.Types.ObjectId(userId);
            const short = await Short.findById(postObjectId);
            const user = await User.findById(userObjectId);
            if (!short) {
                return res.status(404).json({ message: 'Short not found', status: -1 });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }

            if (!short.likes.includes(userId)) {
                short.likes.push(userId);
                if (!user.watchHistory.includes(shortId)) {
                    user.watchHistory.push(shortId);
                }
            }

            await short.save();
            await user.save();
            res.json({ message: 'successfully', status: 1 });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },
    async deleteLike(req, res) {
        try {
            const { shortId, userId } = req.body;
            const postObjectId = mongoose.Types.ObjectId(shortId);
            const userObjectId = mongoose.Types.ObjectId(userId);
            
            const short = await Short.findById(postObjectId);
            const user = await User.findById(userObjectId);
            
            if (!short) {
                return res.status(404).json({ message: 'Short not found', status: -1 });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }
    
            // Kiểm tra xem user đã like bài này chưa
            if (short.likes.includes(userId)) {
                // Xóa userId khỏi danh sách likes
                short.likes = short.likes.filter(id => id.toString() !== userId);
    
                // Xóa shortId khỏi watchHistory của user nếu tồn tại
                user.watchHistory = user.watchHistory.filter(id => id.toString() !== shortId);
    
                // Lưu thay đổi
                await short.save();
                await user.save();
    
                res.json({ message: 'Like and watch history removed successfully', status: 1 });
            } else {
                res.status(400).json({ message: 'User has not liked this post', status: 0 });
            }
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },   
    // Update unLike list
    async updateUnLikes(req, res) {
        try {
            const { shortId, userId } = req.body;
            const short = await Short.findById(shortId);
            const user = await User.findById(userId);
            if (!short) {
                return res.status(404).json({ message: 'Short not found', status: -1 });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found', status: -1 });
            }

            short.unLikes += 1;
            await short.save();
            res.json({ message: 'successfully', status: 1 });
        } catch (err) {
            res.status(400).json({ message: err.message, status: -1 });
        }
    },
    // Get shorts created today
    async getShortsCreatedToday(req, res) {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const shorts = await Short.find({ createdAt: { $gte: startOfDay } }).populate('creator').populate('categories').populate('likes').sort({ createdAt: -1 });;
            res.json({ message: 'successfully', status: 1, shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },


    //--------------------------------------------------------------------------------------------------------------------------



    // Get Shorts by like count
    async getShortsByLikesCount(req, res) {
        try {
            const Shorts = await Short.find().sort({ likes: -1 }).populate('creator').populate('categories').populate('likes').sort({ createdAt: -1 });;
            res.json({ message: 'successfully', status: 1, Shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get Shorts by read count
    async getShortsByReadCount(req, res) {
        try {
            const Shorts = await Short.find().sort({ reads: -1 }).populate('creator').populate('categories').populate('likes').sort({ createdAt: -1 });;
            res.json({ message: 'successfully', status: 1, Shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // Get Shorts created today
    async getShortsCreatedToday(req, res) {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const Shorts = await Short.find({ createdAt: { $gte: startOfDay } }).populate('creator').populate('categories').populate('likes').sort({ createdAt: -1 });;
            res.json({ message: 'successfully', status: 1, Shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    // get Shorts today by category
    async getShortsCreatedTodayByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const Shorts = await Short.find({
                categories: categoryId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            })
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

            res.json({ message: 'successfully', status: 1, Shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    },
    async getTenReadShortsByCategory(req, res) {
        try {
            const categoryId = req.params.categoryId;

            const Shorts = await Short.find({ categories: categoryId })
                .populate('creator')
                .populate('categories')
                .populate('likes')
                .sort({ reads: -1 })
                .limit(10);

            res.json({ message: 'successfully', status: 1, Shorts });
        } catch (err) {
            res.status(500).json({ message: err.message, status: -1 });
        }
    }




};

module.exports = shortController;
