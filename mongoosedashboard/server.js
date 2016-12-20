// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
//create mongoose
var mongoose = require('mongoose');
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
  Animal.find({}, function(err,animals){
      res.render('index', {list:animals});
  })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
})
app.get('/animal/new', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('new');
})

app.post('/animal/new', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.redirect('/');
})

app.post('/animal/:id', function(req, res) {
  Animal.findOne({_id: req.params.id}, function(err, animals) {
    Animal.update({type: req.body.type},function(err, animals) {

      Animal.update({details: req.body.details},function(err, animals) {
      })
    })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.redirect('/animal/'+req.params.id);
  })
})

app.get('/animal/:id', function(req, res) {
  Animal.findOne({_id: req.params.id}, function(err, animals) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('show', {list:animals});
  })
})

app.get('/animal/edit/:id', function(req, res) {
  Animal.findOne({_id: req.params.id}, function(err, animals) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('edit', {list:animals});
  })
})

app.post('/animal/destroy/:id', function(req, res) {
  Animal.remove({_id: req.params.id}, function(err,animals){
      res.redirect('/');
  })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
})

// Setting our Server to Listen on Port: 8000
app.listen(8001, function() {
    console.log("listening on port 8001");
})

mongoose.connect('mongodb://localhost/basic_mongoose');

var AnimalSchema = new mongoose.Schema({
 type: String,
 details: String
})
mongoose.model('Animal', AnimalSchema); // We are setting this Schema in our Models as 'User'
var Animal = mongoose.model('Animal') // We are retrieving this Schema from our Models, named 'User'

mongoose.Promise = global.Promise;

app.post('/animal/', function(req, res) {
  console.log("POST DATA", req.body);

  var animal = new Animal({type: req.body.type, details: req.body.details});

  animal.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      res.redirect('/');
    }
  })
})
