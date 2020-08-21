const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expreSantizer = require('express-sanitizer');
var Blog = require('./models/blogs');

// DATABASE CONNECT MONGOOSE
mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to DB'))
.catch(error => console.log(error.message));

// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(expreSantizer());

// RESTFUL ROUTES

//HOME ROUTE
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// INDEX ROUTE
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, obj) => {
    if(!err){
      res.render('index', {blogs: obj});
    }else {
      console.log(err);
    }
  });
});

// NEW ROUTE
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

//CREATE ROUTE
app.post('/blogs', (req, res) => {
  // sanitizing
  req.body.blog.title = req.sanitize(req.body.blog.title);
  req.body.blog.image = req.sanitize(req.body.blog.image);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  //create a blog
  Blog.create(req.body.blog, (err, obj) => {
    //redirect
    if (!err) {
      res.redirect('/blogs');
    }else {
      res.render('new');
    }
  });
});

//SHOW PAGE
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, obj) => {
    if (err) {
      res.redirect('/blogs');
    }else {
      res.render('show', {blog: obj});
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, obj) => {
    if (err) {
      res.redirect('/blogs');
    }else {
      res.render('edit', {blog: obj});
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
  req.body.blog.title = req.sanitize(req.body.blog.title);
  req.body.blog.image = req.sanitize(req.body.blog.image);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, obj) => {
    if (err) {
      res.redirect('/blogs');
    }else {
      res.redirect('/blogs/'+req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, obj) => {
    if (err) {
      res.redirect('/blogs');
    }else {
      res.redirect('/blogs');
    }
  });
});


app.listen(3000, () => {
  console.log('Server has started....');
});
