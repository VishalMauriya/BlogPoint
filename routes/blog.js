const express = require('express')
const path = require('path')
const blogs = require('../data/myBlogs')

const router = express.Router();

router.get('/', (req, res) =>{
    // res.sendFile(path.join(__dirname, '../templates/index.html'))
    res.render('home');
})

router.get('/blog', (req, res) =>{
    res.render('blogPage', {
        blogs: blogs
    });
    // res.sendFile(path.join(__dirname, '../templates/blogPage.html'))
})

router.get('/blogPost/:slug', (req, res) =>{
   myBlog = blogs.filter((e)=>{
        return e.slug == req.params.slug
   })

   res.render('blogPost', {
    title: myBlog[0].title,
    content: myBlog[0].content
   });
    // res.sendFile(path.join(__dirname, '../templates/blogPost.html'))
})


module.exports = router