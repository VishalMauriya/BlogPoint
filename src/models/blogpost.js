const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;