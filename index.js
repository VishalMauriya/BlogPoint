const express = require('express')
// const allblogs = require('data/myBlogs')
var exphbs  = require('express-handlebars');
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/myBlogs');

// const Blog = mongoose.model('content', { name: String });

// const blogDB = new Blog({ name: 'vishal' });
// blogDB.save().then(() => console.log(blogDB.name));

// const MyModel = mongoose.model('myBlogs', new Schema({ name: String }));
// const doc = new MyModel();
// const doc = await MyModel.findOne();
// Blog.find()
//     .then(p => console.log(p))
//     .catch(error => console.log(error));

// doc instanceof MyModel; // true
// doc instanceof mongoose.Model; // true
// doc instanceof mongoose.Document; // true

const path = require('path')
const app = express()
const port = 3000

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// app.use(express.static(path.join(__dirname, "data/myBlogs.js")))
// express middleware
app.use(express.static('images'))
// app.use(express.static(path.join(__dirname, "static")))
app.use('/', require(path.join(__dirname, 'routes/blog.js')))


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})