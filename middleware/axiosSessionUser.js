
const axiosSession= (req,res,next)=>{
    if(req.session.loginuser){
        console.log('axios session true');
   next();

    }else{
        console.log('axios session false');
        res.json({session:true})
    }
}
module.exports={axiosSession}