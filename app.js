var express=require('express');
var app=express();
var expressSession=require('express-session');
var expressValidator=require('express-validator');

var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});


//controllers

var signupController=require('./controllers/signup-controller');
//set up template engine
app.set('view engine','ejs');

//for static files
app.use(express.static('./public'));

// fire controllers
signupController(app);

app.listen(3000);
console.log('listening...!!! port 3000');
