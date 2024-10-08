const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    // người tạo
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
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
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    }],
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
    type:{
        type:Number,
        enum: [0,1],
        default:0
    },
    comments:
    [{ type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
