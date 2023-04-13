const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String, required: true, default: "Hlo, I'm a new Blog user"},
  phno: { type: Number},
  companyname: { type: String},
  cwebsite: { type: String},
  instagram: { type: String},
  twitter: { type: String},
  linkedin: { type: String},
  github: { type: String},
  instagram: { type: String},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
