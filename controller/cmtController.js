const { Post } = require('./../models/Post');
const { User } = require('./../models/User');
const { Short } = require('./../models/Short')
const { Comment } = require('./../models/Comment');
const comtController = {
  async createCmt(req, res) {
    try {
      const { content, userId, postId, shortId, parentCommentId } = req.body;

      if (!content || !userId) {
        return res.status(400).json({ message: 'Content and userId are required' });
      }

      const newComment = new Comment({
        content,
        user: userId,
        post: postId || null,
        short: shortId || null,
        parentComment: parentCommentId || null
      });

      await newComment.save();
      // Nếu là trả lời comment
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment) {
          return res.status(404).json({ message: 'Parent comment not found' });
        }
        parentComment.replies.push(newComment._id);
        await parentComment.save();
      } else {
        // Nếu là comment cho Post hoặc Short
        if (postId) {
          await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
        } else if (shortId) {
          await Short.findByIdAndUpdate(shortId, { $push: { comments: newComment._id } });
        }
      }
      // Thêm comment vào danh sách comments của User
      await User.findByIdAndUpdate(userId, { $push: { comments: newComment._id } });

      res.status(201).json({ message: 'successfully', status: 1, newComment });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  async getCmtByPost(req,res){
    try {
      const { postId } = req.params;
  
      // Kiểm tra nếu postId được cung cấp
      if (!postId) {
        return res.status(400).json({ message: 'postId is required' });
      }
      // Tìm bài viết theo postId và populate comments
      const post = await Post.findById(postId)
        .populate({
          path: 'comments',
          populate: [
            {
              path: 'user',
              select: 'name avatar' // Chỉ lấy thông tin cần thiết của user
            },
            {
              path: 'replies',
              populate: {
                path: 'user',
                select: 'name avatar' // Populate thông tin user của replies
              }
            }
          ]
        })
        .exec();
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(post.comments);
    } catch (error) {
      console.error('Error getting comments by postId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  async getCmtByShort(req,res){
    try {
      const { shortId } = req.params;
  
      // Kiểm tra nếu postId được cung cấp
      if (!shortId) {
        return res.status(400).json({ message: 'shortId is required' });
      }
      // Tìm bài viết theo postId và populate comments
      const short = await Short.findById(shortId)
        .populate({
          path: 'comments',
          populate: [
            {
              path: 'user',
              select: 'name avatar' // Chỉ lấy thông tin cần thiết của user
            },
            {
              path: 'replies',
              populate: {
                path: 'user',
                select: 'name avatar' // Populate thông tin user của replies
              }
            }
          ]
        })
        .exec();
  
      if (!short) {
        return res.status(404).json({ message: 'Short not found' });
      }
  
      res.status(200).json(short.comments);
    } catch (error) {
      console.error('Error getting comments by shortId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
module.exports = comtController