const express = require('express')
const moment = require('moment');
const Contact = require('../src/models/contact');
const User = require('../src/models/user');
const Comment = require('../src/models/comment');
const MyData = require('../src/models/data');
const BlogPost = require('../src/models/blogpost');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = express.Router();

// Parse incoming request bodies as JSON
router.use(bodyParser.json());

// Parse incoming request bodies as urlencoded
router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
  secret: 'data',
  resave: false,
  saveUninitialized: true,
}));

router.get('/home', (req, res) =>{
    res.render('home');
})

router.get('/edit', (req, res) =>{
  res.render('edit');
})

router.get('/writeblog', (req, res) =>{
  res.render('newBlog');
})

// router.get('/blog', async (req, res) => {
  // try {
  //   const data = await MyData.find({}).populate('author').lean();
  //   data.forEach(post => {
  //     const date = new Date(post.createdOn);
  //     const formattedDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  //     post.date = formattedDate; 
  //     post.createdOn = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  //   });
  //   res.render('blogPage', { data });
  // } catch (err) {
  //   console.log(err);
  //   res.render('error', { error: err });
  // }
// });

router.get('/blog', (req, res) => {
  MyData.find({}, (err, blogposts) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    // create an array of promises to fetch comment counts for each blogpost
    const promises = blogposts.map((blogpost) => {
      return Comment.countDocuments({ blogid: blogpost._id }).exec()
        .then((count) => {
          return User.findById(blogpost.author).exec()
            .then((user) => {
              return {
                id: blogpost._id, 
                title: blogpost.title,
                content: blogpost.content,
                category: blogpost.category,
                author: blogpost.author,
                date: moment(blogpost.createdOn).format('MMMM Do, YYYY'),
                time: moment(blogpost.createdOn).format('h:mm a'),
                commentCount: count, 
                userName: user ? user.name : ''
              };
            })
            .catch((err) => {
              console.error(err);
              return null;
            });
        })
        .catch((err) => {
          console.error(err);
          return null;
        });
    });

    // wait for all promises to resolve before rendering the view
    Promise.all(promises).then((data) => {
      res.render('blogPage', { blogposts: data });
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
  });
});


router.get('/blogPost/:id', async (req, res) => {
  const blog = await MyData.findById(req.params.id).populate('author').lean();
  const formattedDate = blog.createdOn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = blog.createdOn.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  console.log(blog);

  const comments = await Comment.find({ blogid: req.params.id }).populate('userid').lean();
  comments.forEach(post => {
    const date = new Date(post.createdAt);
    const formattedDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    post.date = formattedDate; 
    post.createdAt = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  });

  res.render('blogPost', { blog: { ...blog, formattedDate, formattedTime }, comments, len:comments.length });
});

router.get('/', function(req, res) {
  res.setHeader('Expires', '-1');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.render('auth', { isLoginPage: true });
  });

  router.post('/signup', function(req, res) {
    const { name, username, password } = req.body;
    const newUser = new User({ name, username, password });
    newUser.save()
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
        res.status(201).send('Error while Registering!');
      });
  });

  router.post('/update', function(req, res) {
    // const { name, username, password } = req.body;
    const userId = req.session.user._id;
    const update = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
      phno: req.body.phno,
      companyname: req.body.companyname,
      cwebsite: req.body.cwebsite,
      instagram: req.body.instagram,
      twitter: req.body.twitter,
      linkedin: req.body.linkedin,
      github: req.body.github
    };
    User.findByIdAndUpdate(userId, update, { new: true }, (err, doc) => {
      if (err) {
        console.log(err);
        res.status(201).send('Error while updating!');
      } else {
        res.redirect('/account');
      }
    });
  });

  router.post('/comment', function(req, res) {
    const user = req.session.user;

    const {type, blogid, message} = req.body;
    const newComment = new Comment({userid: user._id, blogid, message });
     newComment.save()
      .then(() => {
        if(type == '0'){
          res.redirect("/blog");
        }else{
          res.redirect(303, "/blogPost/"+blogid);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(201).send('Error while Commenting!');
      });
  });

  router.post('/addblog', function(req, res) {
    const user = req.session.user;

    const {title, category, content } = req.body;
    const newBlogPost = new BlogPost({author: user._id, title, category, content });
    newBlogPost.save()
      .then(() => {
        res.redirect('/blog');
      })
      .catch((err) => {
        console.log(err);
        res.status(201).send('Error while adding blog!');
      });
  });

    router.get('/api/posts', async (req, res) => {
      const { page, limit, author } = req.query;
      const skip = (page - 1) * limit;
      try {
        const blogs = await MyData.find({ author: author }).sort('-createdOn').skip(skip).limit(limit);
        res.json({ blogs });  
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
    });
  // const POSTS_PER_PAGE = 2;
  router.get('/account', async function(req, res) {
    const POSTS_PER_PAGE = 2;
    const UID = req.session.user._id;
  try {
    const blogs = await MyData.find({ author: UID }).sort('-createdOn').limit(POSTS_PER_PAGE).lean();
    const user = await User.findById( UID ).lean();
    blogs.forEach(post => {
      const date = new Date(post.createdOn);
      const formattedDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      post.date = formattedDate; 
      post.createdOn = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    });
    res.render('account', {user: user, UID, blogs,POSTS_PER_PAGE });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
  });
  
  router.post('/login', function(req, res) {
    const { username, password } = req.body;
    User.findOne({ username: username, password: password })
      .then((user) => {
        if (user) {
          // console.log(user);
          req.session.user = user;
          res.redirect('/home');
        } else {
          res.redirect('/');
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      });
  });

  router.get('/userprofile/:slug', async (req, res) =>{
    const POSTS_PER_PAGE = 2;
    const UID = req.params.slug;
  try {
    const blogs = await MyData.find({ author: UID }).sort('-createdOn').limit(POSTS_PER_PAGE).lean();
    blogs.forEach(post => {
      const date = new Date(post.createdOn);
      const formattedDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      post.date = formattedDate; 
      post.createdOn = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    });
    
    console.log(blogs)
    User.findOne({ _id: req.params.slug}).lean()
    .then((user) => {
      if (user) {
        res.render('account', {user,blogs,UID,POSTS_PER_PAGE });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
 })

router.get('/contact', (req, res) =>{
    res.render('contact');
})

router.post('/contact', async (req, res) => {
    const { name, email, phone, message } = req.body;
  
    try {
      const newContact = new Contact({ name, email, phone, message });
      await newContact.save();
      res.status(201).send('Form submitted successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error submitting form.');
    }
  });

  // router.get('/blog', async (req, res) => {
  //   MyData.find({}).lean().exec(function(err, blogs) {
  //     if (err) throw err;
  //     console.log("Fetched blog data");
    
  //     // Pass the blog data to Handlebars
  //     res.render('blogPage', {blogs: blogs});
  //   });
    
    
  // });

module.exports = router