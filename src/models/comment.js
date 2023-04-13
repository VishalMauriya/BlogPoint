const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userid: { type: String, required: true, ref: 'User' },
    blogid: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
