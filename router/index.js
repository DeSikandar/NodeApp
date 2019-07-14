const router=require('express').Router();
const {ensureAuthenticated}=require('../config/auth');
const User =require('../model/User');



router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/dashborad',ensureAuthenticated,(req,res)=>{
    User.find()
    .then(user=>{
        if(!user) throw err
        res.render('dashborad',{

            us:req.user,
            emp:user
        });
    })
    .catch(err=>console.log(err))
    
    
});

module.exports=router;