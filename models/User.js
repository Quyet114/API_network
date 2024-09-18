const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 20,
        required: true
    },
    email: {
        type: String,
        minlength: 6,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 100,
        required: true
    },
    avatar: {
        type: String,
        default: "https://tse1.mm.bing.net/th?id=OIP.nyxmxn1EB1208lnguYtYxQHaHa&pid=Api&P=0&h=220"
    },
    authenticated: {
        type: Boolean,
        default: false
    },
    userPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    userShort: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Short'
    }],
    likeHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    readHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Short'
    }],
    follower: [{
        followeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: [0, 1, 2],
            default: 0
        }
    }],
    vetify: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    about: {
        type: String,
        maxlength: 500
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };
