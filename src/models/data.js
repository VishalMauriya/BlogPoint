const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myDataSchema = new Schema({
  title: String,
  author: { type: String, required: true, ref: 'User' },
  category: String,
  content: String
});

const MyData = mongoose.model('blogposts', myDataSchema);
module.exports = MyData;