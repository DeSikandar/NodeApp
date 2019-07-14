const router=require('express').Router();
const monogoose=require('mongoose');
const User=require('../model/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const {ensureAuthenticated}=require('../config/auth');
const uploader =require('../config/uploader');



router.get('/login',(req,res)=>{
    res.render("login");
});

router.get('/register',(req,res)=>res.render('register'));

//handle the post requirest
router.post('/register',(req,res)=>{
    let errors=[];
    const {name,email,password,password2}=req.body;
    if(!name||!email||!password||!password2){
        errors.push({msg:'Please Enter all Fields'});
    }
    if(password!==password2){
        errors.push({msg:'Password Donot MAtch'});
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });

    }else{
        User.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push({msg:"User Already Exist!"});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser=new User({
                    name,
                    email,
                    password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password=hash;
                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are successufully regitster');
                            res.redirect('/user/login');
                        })
                        .catch(err=>console.log(err));
                    })
                })

            }
        })
        .catch(err=>console.log(err));

       
    }
    
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashborad',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next);
    
});

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logout ');
    res.redirect('/user/login');
});

router.get('/edit/:id',ensureAuthenticated, (req,res)=>{
    console.log(req.params.id);
    User.findById({_id:req.params.id},(err,user)=>{
        console.log(user);
        res.render('edit',{
            user:user,
            name:user.name,
            email:user.email,
            password:user.password,
            password2:user.password
});
    });
});

router.post('/edit/:id',ensureAuthenticated,(req,res)=>{
    User.findByIdAndUpdate({_id:req.params.id},{name:req.body.name,email:req.body.email,password:req.body.password},(err,docs)=>{
        if(err) throw err;
        req.flash('success_msg','Successfully updated');
        res.redirect('/dashborad');
    })
    console.log(req.body);
});

router.get('/delete/:id',ensureAuthenticated,(req,res)=>{
    User.findByIdAndDelete({_id:req.params.id},(err,re)=>{
        if(err) throw err;
        req.flash('success_msg','Succefully deleted');
        res.redirect('/dashborad');
    });
});

router.get('/adduser', ensureAuthenticated,(req,res)=>{
    res.render('adduser');
});

router.post('/adduser', ensureAuthenticated,(req,res)=>{
    uploader(req,res,(err)=>{
        if(err) throw err;
        
        const {name,email,password,password2}=req.body;
        
        let errors=[];
        if(!name||!email||!password||!password2){
            errors.push({msg:"All Field Are Required"});
        }
        if(password!==password2){
            errors.push({msg:"Password Donot Match"});
        }
        if(errors.length>0){
            res.render('adduser',{
                errors,
                name,
                email,
                password,
                password2:password2
            });
        }else{
            User.findOne({email:email},(err,user)=>{
                if(err) throw err;
                if(user){
                    errors.push({msg:"Email Already Exist"});
                    res.render('adduser',{
                        errors,
                        name,
                        email,
                        password,
                        password2:password2
    
                    });
                }else{
                    if(req.file){const file_path= req.file.filename
                    
                        const addUser=new User({
                            name,
                            email,
                            password,
                            photo:file_path
                        });
                    };
                    const addUser=new User({
                        name,
                        email,
                        password,
                       
                    });
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(addUser.password,salt,(err,has)=>{
                            addUser.password=has;
                            addUser.save();
                            req.flash('success_msg',"User added success");
                            res.redirect('/dashborad');
                        });
                    });
                }
            });
        }
        
   
    });
    
    
   
    
});

module.exports=router;