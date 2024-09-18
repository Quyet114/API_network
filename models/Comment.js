
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String, 
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: false }, // Reference to the post
  short: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Short', 
    required: false }, // Reference to the short
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    required: false }, // Reference to parent comment
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' }], // Array of replies
  createdAt: { 
    type: Date,
    default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema)
module.exports = {Comment};
