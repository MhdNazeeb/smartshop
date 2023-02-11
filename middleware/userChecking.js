
const session= (req,res,next)=>{
    if(req.session.loginuser){
        console.log('here is session true');
   next();

    }else{
        console.log('here is session false');
        res.redirect('/login');
    }
}
module.exports={session}