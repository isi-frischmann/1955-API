const path = require('path');

// server
const port = 8000;


var express = require('express');
const app = express();


// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// view engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, './static')));

// require mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/newOne');

// create a new Schema 
var UserSchema = new mongoose.Schema({
    fname: { type: String }
}, {timestamps: true})

// create collection
mongoose.model('User', UserSchema);
var User = mongoose.model('User');


// ROUTING
// show all users
app.get('/', function(req, res){
    User.find({}, function(err, allUsers){
        if(err){
            console.log(err);
            res.json({message: "Error", error: err});
        }
        else{
            console.log("-------------------");
            console.log(allUsers);

            res.json({message: "Success", data: allUsers});
        }
    })
    
})

// create new user
app.get('/new/:fname', function(req, res){
    User.create({}, function(err, newUser){
        if(err){
            console.log("Something went wrong", err);
            res.json({message: "Error", error: err});
        }
        else{
            console.log("Added new User");
            newUser = new User({fname: req.params.fname});
            newUser.save();
            console.log(newUser.fname);
            res.json({message: "Successfully added a new User", newUser});
        }
    })
})

// remove one user
app.get('/remove/:fname', function(req, res){
    console.log("I'm here--------------");
    User.remove({fname: req.params.fname}, function(err, removeUser){
        if(err){
            console.log("Im inside the delete but not deleting anything");
            res.json({message: "Error", error: err});
        }
        else{
            console.log(removeUser);
            console.log('User is deleted');
            res.json({message: "User is deleted"});
        }
    })
})

// show specific user
app.get('/:fname', function(req, res){
    console.log("I show you the User after I find one");
    User.findOne({fname: req.params.fname}, function(err, specUser){
        console.log(specUser);
        // console.log(fname);
        console.log(req.params.fname);
        if(err){
            res.json({message: "Error", error: err});
        }
        else{
            console.log("Thats your user");
            res.json({message: "That the specific User, you're looking for", user: specUser});
        }
    })
})



const server = app.listen(port)