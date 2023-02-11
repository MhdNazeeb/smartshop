
const session= (req,res,next)=>{
    if(req.session.login){
   next();

    }else{
        res.redirect("/admin");
    }
}
module.exports={session}