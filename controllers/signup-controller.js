var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false})
var mongoose=require('mongoose');
var expressValidator=require('express-validator');
var expressSession=require("express-session");
//connnect to mongodb database
mongoose.connect('mongodb://localhost/loginapp');
//mongoose.connect('mongodb://test:test@ds157390.mlab.com:57390/todo');


//create a schema for signup

var signupSchema=new mongoose.Schema({
  rollno:{type:String,unique:true},
  password:{type:String},
  department:{type:String},
  email:{type:String},
  active:{type:Boolean},
  blog:[String],
  wing:{type:String},
  status:{type:Number},
  fname:{type:String},
  lname:{type:String},
  city:{type:String},
  address:{type:String},
  twitterlink:{type:String},
  facebooklink:{type:String},
  aboutme:{type:String},
  notice:[{title:String,description:String,timestamp:Date}]
})


var teacherSchema=new mongoose.Schema({
  fname:{type:String},
  lname:{type:String},
  department:{type:String},
  email:{type:String},
  username:{type:String},
})
var imageSchema=new mongoose.Schema({

})

var StudentAccount=mongoose.model('StudentAccount',signupSchema);
var TeacherAccount=mongoose.model('TeacherAccount',teacherSchema);

module.exports=function(app){

app.use(expressValidator());
app.use(expressSession({secret:'max',saveUninitialized:false,resave:false}));

var father;
var mailer;
app.get('/',function(req,res){
  console.log("You requested for the url: "+req.url);
  res.render('index',{success:req.session.success,errors:req.session.errors});
  req.session.errors=null;
})


app.get('/signup',function(req,res){
  console.log("You requested for : "+req.url);
  var msg="";
  res.render('signup',{msg:msg});
})


app.post('/signup',urlencodedParser,function(req,res){
  console.log("you requested for : "+req.url);
  //console.log(req.body.rollno);
  //var newStudent=StudentAccount({rollno:req.body.rollno}).
/*  var newStudent=StudentAccount(req.body).save(function(err,data){
    if(err){
      var msg="Sorry user already exists"
      res.render('signup',{msg:msg});
    }
    res.redirect('success')
  })*/
  try{
    var newStudent=StudentAccount(req.body).save(function(err,data){
      if(err){
        if(err.name === 'MongoError' && err.code === 11000){
          var msg="Sorry user already exists"
          res.render('signup',{msg:msg});

        }
      }
      else {
        res.redirect('success')
      }

    })
  }catch(ex)
  {
    var msg="Sorry user already exists"
    res.render('signup',{msg:msg});
  }
})

app.get('/success',function(req,res){
  console.log("you requested for the url: "+req.url);
  res.render('success')
})

app.get('/login',function(req,res){
  if(req.session.success)
  {
    res.redirect('profile/'+req.session.rollno);
  }
  console.log("you requested for the get url: "+req.url);
  var logmsg="";
  res.render('login',{logmsg:logmsg});
})

app.get('/login-teacher',function(req,res){
  var logmsg="";
  res.render('login',{logmsg:logmsg});

})

app.post('/login-teacher',function(req,res){
console.log("you requested for the url: "+req.url);
res.render('login-teacher');

})

app.post('/login',urlencodedParser,function(req,res){

  console.log("you requested for the post url: "+req.url);
  // check validity
  req.check('email','Invali Email').isEmail();

    var findy=StudentAccount.find({rollno:req.body.rollno,password:req.body.password},function(err,data){
    if(err) throw err
    if(data.length!=0){
      console.log("posyy login: "+data[0].rollno);

      req.session.success=true;
      req.session.rollno=req.body.rollno;
      req.session.id=req.sessionID;
      father=req.session.id;
      mailer=req.session.rollno+""+req.session.id;
      console.log(req.session.id);
      console.log(mailer);
      var id=req.body.rollno;
      if(data[0].status==1)
      {
        res.redirect('student-home/'+id);
      }
      else if(data[0].status==2){
        res.redirect('admin-add-notice');
      }
    }
    else{
      var logmsg="no user found"
      res.render('login',{logmsg:logmsg})
    }
  })

})

app.get('/profile/:id',function(req,res){
  console.log("You requested for the url: "+req.url);

  var kasam=req.params.id+""+req.sessionID;
  if(mailer===kasam)
    {
      console.log("here i print: "+req.params.id);
      console.log(req.sessionID);

      var findy=StudentAccount.find({rollno:req.params.id},function(err,data){
        if(err) throw err
        console.log("m printing roll no: "+req.params.id);
       console.log("m printing roll no: "+data[0].rollno);
        res.render('profile',{person:req.params.id,data:data[0]});
      })
      //console.log("m printing roll no: "+findy);


    }
    else {
      var logmsg="login first"
      res.render('login',{logmsg:logmsg})
    }

})


app.get('/profileedit/:id',function(req,res){
  console.log("You requested for the url: "+req.url);

  if(req.session.email)
    {
      console.log(req.sessionID);
      res.render('profile',{person:req.params.id});
    }
    else {
      var logmsg="login first"
      res.render('login',{logmsg:logmsg})
    }

})

app.get('/admin-signup',function(req,res){
  console.log("you requested for the url: "+req.url);
  res.render('admin-signup');
})

app.post('/admin-signup',urlencodedParser,function(req,res){
  console.log("you requested for : "+req.url);
  var tot=parseInt(req.body.endno);
  console.log(tot);
  var roll=req.body.rollString;
  for(count=1;count<tot;count++)
  {
    var num=count.toString();
      var completeRoll=roll+num;
    var newStudent=StudentAccount({rollno:completeRoll,password:completeRoll,department:req.body.department}).save(function(err,data){
        if(err) throw err
    })
  }
  res.redirect('success');
})

app.get('/admin-student',function(req,res){
  console.log("you requested for the url admin-: "+req.url);
  var allStudents=StudentAccount.find({department:"cse"},function(err,data){
    if(err) throw err
    res.render('admin-student',{data:data})
  })
})


app.get('/profile-write-blog/:id',function(req,res){
  console.log("you requested for the blog post url: "+req.url);
  var email=req.params.id;
//  res.render('profile-write-blog',{email:req.params.id});
var student=StudentAccount.find({email:req.params.id},function(err,data){
  if(err) throw err
  res.render('profile-write-blog',{email:req.params.id,blogs:data[0].blog});
})
})

app.post('/student-home/:id',urlencodedParser,function(req,res){
  console.log("you requested for the post blog postss url: "+req.url);
  var student=StudentAccount.find({rollno:req.params.id},function(err,data){
    if(err) throw err

    console.log("the rollno is: "+data[0].rollno);
    console.log("the post is: "+req.body.blog);
    data[0].blog.push(req.body.blog).save;
    var newBlog=StudentAccount.update({rollno:req.params.id},{$push:{blog:req.body.blog}},function(err,sdata){
      console.log(sdata);
    });
  //  console.log("themongo data post is: "+data[0].blog[0]+" and roll no s: "+data[0].rollno);
      var locmail=req.params.id;
      var str='profile/'+locmail;
      console.log(str);
      res.render('student-home',{data:data[0]});
    //res.render('profile',{person:req.params.id,blogs:data[0].blog});

  })
})


app.get('/logout',function(req,res){
req.session.success=false;
  req.session.destroy(function(err,data){
    if(err) throw err
    else{

      mailer="";
      res.redirect('/login');
    }
  })

})

app.get('/admin-dashboard',function(req,res){
  res.render('admin-dashboard');
})

app.get('/admin-add-batch',function(req,res){
  var msg="Hi,Add the Bright Students account here...."
  res.render('admin-add-batch',{msg:msg});
})


app.post('/admin-add-batch',urlencodedParser,function(req,res){
  console.log("you requested for the url: "+req.url);
  var tot=parseInt(req.body.totalStrength);
  console.log(tot);
  var roll=req.body.rollString;
  for(count=1;count<=tot;count++)
  {
    var num=count.toString();
    var completeRoll=roll+num;
    var newStudent=new StudentAccount({rollno:completeRoll,password:completeRoll,department:req.body.department,wing:req.body.wing,status:1}).save(function(err,data){
      if(err) throw err


    })
  }
  var msg="Succesfully created new Batch";
  res.render('admin-add-batch',{msg:msg});
})

app.get('/trial/:id',function(req,res){

  var studentAccount=StudentAccount.find({rollno:req.params.id},function(err,data){
    if(err) throw err
    console.log(data);
    var msg="";
    if(data.length!=0)
    {
      res.render('trial',{data:data[0],msg:msg,rollno:req.params.id});
    }
    else{
      res.send("sorry no user found");
    }
  })

})


app.post('/trial/:id',urlencodedParser,function(req,res){
  console.log("you requested for post url: "+req.url);
  console.log("for mail is: "+req.params.id);

  var student=StudentAccount.find({rollno:req.params.id},function(err,data){
    if(err) throw err

    var newBlog=StudentAccount.update({rollno:req.params.id},{$set:{email:req.body.email,fname:req.body.fname,lname:req.body.lname,city:req.body.city,address:req.body.address,twitterlink:req.body.twitterlink,facebooklink:req.body.facebooklink,aboutme:req.body.aboutme}},function(err,sdata){
  if(err) throw err


})
    //res.render('profile',{person:req.params.id,blogs:data[0].blog});
    var msg="Succesfully updated...!!"
    res.render('trial',{data:data[0],msg:msg});
  })

})

app.get('/admin-add-notice',function(req,res){
  var msg="add here.."
  res.render('admin-add-notice',{email:req.params.id,msg:msg});
})


app.post('/admin-add-notice',urlencodedParser,function(req,res){
  console.log("you requested for the url: "+req.url);
//  var student=StudentAccount.find()
  var studentAccount=StudentAccount.find({username:"admin"},function(err,data){
    if(err) throw err
    console.log(data[0].status);
    var newBlog=StudentAccount.update({username:"admin"},{$push:{'notice':{title:req.body.title,description:req.body.description}}},function(err,sdata){
      console.log(req.body.title);
      console.log(req.body.description);
      console.log(req.params.id+" ths s the mail");
    });
  })
  var msg="sucessfully added, Add new.."
  res.render('admin-add-notice',{msg:msg});
})

app.get('/admin-home',function(req,res){
  console.log("you requested for the url: "+req.url);
  res.render('admin-home');
})


app.get('/admin-add-teacher',function(req,res){
console.log("you requested for the url: "+req.url);
var msg="";
res.render('admin-add-teacher',{msg:msg});
})

app.post('/admin-add-teacher',urlencodedParser,function(req,res){
  console.log("you requested for the url: "+req.url);
  var newTeacher=TeacherAccount({fname:req.body.fname,lname:req.body.lname,department:req.body.department,email:req.body.email,username:req.body.uname}).save(function(err,data){
    if(err) throw err
    var msg="sucessfully added"
    res.render('admin-add-teacher',{msg:msg});
  })
})

app.get('/student-view-notice/:id',function(req,res){
  console.log("you requested for the url: "+req.url);

  console.log("You requested for the url: "+req.url);

  var kasam=req.params.id+""+req.sessionID;
  if(mailer===kasam)
    {
      console.log("here i print: "+req.params.id);
      console.log(req.sessionID);

      var findy=StudentAccount.find({username:"admin"},function(err,data){
        if(err) throw err
        console.log("m printing roll no: "+req.params.id);
       //console.log("m printing roll no: "+data[0].rollno);
       if(data.length!=0)
       {
         console.log(data[0].notice);
         console.log(data[0].notice[1].title);
         console.log(data[0].notice.length);
          res.render('student-view-notice',{notice:data[0].notice});
       } //check ek baar u have to s
       else{
         res.send("no data found");
       }
      })
      //console.log("m printing roll no: "+findy);


    }
    else {
      var logmsg="login first"
      res.render('login',{logmsg:logmsg})
    }


})
app.get('/student-home/:id',function(req,res){
  console.log("you requested for the url: "+req.url);

  console.log("You requested for the url: "+req.url);

  var kasam=req.params.id+""+req.sessionID;
  if(mailer===kasam)
    {
      console.log("here i print: "+req.params.id);
      console.log(req.sessionID);

      var findy=StudentAccount.find({rollno:req.params.id},function(err,data){
        if(err) throw err
        console.log("m printing roll no: "+req.params.id);
       console.log("m printing roll no: "+data[0].rollno);
        res.render('student-home',{data:data[0]});
      })
      //console.log("m printing roll no: "+findy);


    }
    else {
      var logmsg="login first"
      res.render('login',{logmsg:logmsg})
    }


})

app.get('/student-view-friends/:id',function(req,res){

  console.log("you requested for the url: "+req.url);

  console.log("You requested for the url: "+req.url);

  var kasam=req.params.id+""+req.sessionID;
  if(true)
    {
      console.log("here i print: "+req.params.id);
      console.log(req.sessionID);

      var findy=StudentAccount.find({rollno:req.params.id},function(err,sdata){
        if(err) throw err
        console.log("m printing roll no: "+req.params.id);
       //console.log("m printing roll no: "+data[0].rollno);
          var cityFind=StudentAccount.find({city:sdata[0].city},function(err,data){
            if(err) throw err
            console.log(data);
            console.log(data[0].rollno)
            res.render('student-view-friends',{data:data})
          })
      })
      //console.log("m printing roll no: "+findy);


    }
    else {
      var logmsg="login first"
      res.render('login',{logmsg:logmsg})
    }


})

}
