const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 20,
    },
    email: {
        type: String,
        minlength: 6,
    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 20,
    },
    avatar: {
        type: String,
        default: "https://tse1.mm.bing.net/th?id=OIP.nyxmxn1EB1208lnguYtYxQHaHa&pid=Api&P=0&h=220"
    },
    type: {
        type: Number,
        default: 1
    },
    about: {
        type: String,
        default: "admin"
    },
    friends: [{
        friendId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['requested','waitAccept', 'friends', 'blocked'],
            default: 'requested'
        }
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = { User };
