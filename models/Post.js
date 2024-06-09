const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    creator: {
        type: String,
        minlength: 1,
        maxlength: 200,
    },
    tags: [{
        friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    text: {
        type: String,
        maxlength: 200
    },
    images: {
        type: [String],
        default: ["https://res.cloudinary.com/dyjxyz2jc/image/upload/v1701619966/demo1/nykb1ynap7gqejbnhnmq.jpg"]
    },
    type: {
        type: Number,
        default: 1
    }
}, { timestamps: true });
const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
