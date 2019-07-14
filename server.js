const express=require('express');
const expressLayout=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const multer=require('multer');
const path=require('path');
const upload=multer();
// const upload=require('./config/uploader');


// //set storage Engine
// const storage=multer.diskStorage({
//   destination:'./public/uploads/',
//   filename:function(req,file,cb){
//       cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
//   }
// });

// //Init upload
// const upload=multer({
//     storage:storage
// }).single('file');



const app=express();

//passport confin
require('./config/passport')(passport);


//static folder
app.use(express.static(__dirname+'/public'));

//db connection 
mongoose.connect(process.env.Dbconnection||'mongodb://127.0.0.1:27017/myapp',{useNewUrlParser:true})
.then(()=>console.log("Db connected"))
.catch(err=>console.log("erro to connect"+err));


// //ejs
app.use(expressLayout);
app.set('view engine','ejs');

// //body parser
app.use(express.urlencoded({extended:false}));
// app.use(upload.single('file'));

// app.use(express.multipart());

//Express session middleware
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connet-flahs
app.use(flash());


//gloabl bars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    
    next();
});

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });


app.use('/',require('./router/index'));
app.use('/user',require('./router/user'));




const PORT=process.env.PORT||3000;

app.listen(PORT,()=>console.log(`Server Started on PORT ${PORT}`));
