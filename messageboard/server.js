// Dependencies
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    port = 3000;

// Create express app
var app = express();
mongoose.Promise = global.Promise;
// Use bodyParser to parse form data sent via HTTP POST
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './static')));
// Tell server where views are and what templating engine I'm using
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Create connection to database
var connection = mongoose.connect("mongodb://localhost/dog_db");

var Schema = mongoose.Schema;
// Create dog schema and attach it as a model to our database
var MessageSchema = new mongoose.Schema({

    name: {type: String, required: true, minlength: 4},
    message: {type: String, required: true, minlength: 4},
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]
}, {timestamps:true});

var CommentSchema = new mongoose.Schema({
    _message: {type: Schema.Types.ObjectId, ref: 'Message'},
    namecomment: {type: String, required: true, minlength: 4},
    messagecomment: {type: String, required: true, minlength: 4}
}, {timestamps:true});

// Mongoose automatically looks for the plural version of your model name, so a Dog model in Mongoose looks for 'dogs' in Mongo.
mongoose.model('Message', MessageSchema);
mongoose.model('Comment', CommentSchema);

var Message = mongoose.model('Message');
var Comment = mongoose.model('Comment');
// Routes go here!

// Show
app.get('/', function(req, res){
  Message.find({})
  .populate('comments')
  .exec(function(err, results) {
  res.render('messageboard', { message: results});
  });
});


// Create Message
app.post('/', function(req, res){
  // Create a new quote!
  Message.create(req.body, function(err, result){
    // data from form on the front end

     if(err) {
          console.log('Error');
     } else {
          res.redirect('/');
     }

  });
});

// Create comment
app.post('/:id', function(req, res){
  Message.findOne({_id: req.params.id}, function(err, message){
         var comment = new Comment(req.body);
         comment._message = message._id;
         message.comments.push(comment);
         comment.save(function(err){
            if(err) { console.log('Error'); }  
                 message.save(function(err){
                       if(err) { console.log('Error'); }
                       else { res.redirect('/'); }
                 });
         });
  });
});






app.listen(8001, function(){
  console.log("Running on 8001");
})
