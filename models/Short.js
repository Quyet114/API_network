const mongoose = require('mongoose');

const shortSchema = new mongoose.Schema({
    // người tạo
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        maxlength: 200,
    },
    // nội dung
    text: {
        type: String,
        maxlength: 2000,
    },
    // ảnh
    images: [{
        type: String,
    }],
    // thể loại 
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    // số lượng người thích
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // số lượng người không thích
    unLikes: {
        type: Number,
        default: 0
    },
    // số lượng người đọc
    reads: {
        type: Number,
        default: 0
    },
    // trạng thái bài: ẩn, hiển thị
    type: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    music: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music'
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const Short = mongoose.model("Short", shortSchema);

module.exports = { Short };
