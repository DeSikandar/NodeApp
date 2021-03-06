const multer=require('multer');
const path=require('path');


//storage engin
const storage=multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

const upload=multer({
    storage:storage
}).single('file');

module.exports=upload;