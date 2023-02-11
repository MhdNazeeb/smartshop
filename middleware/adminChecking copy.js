
const sessionAxios= (req,res,next)=>{
    if(req.session.login){
   next();

    }else{
       
    }
}
module.exports={sessionAxios}