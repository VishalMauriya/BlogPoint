const express = require('express')
// const allblogs = require('data/myBlogs')
var exphbs  = require('express-handlebars');
require('./src/database/conn.js');

const path = require('path')
const app = express()
const port = 3000

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// app.use(express.static(path.join(__dirname, "data/myBlogs.js")))
// express middleware
app.use(express.static('images'))
// app.use(express.static(path.join(__dirname, "static")))
app.use('/', require(path.join(__dirname, 'routes/blog.js')))


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})