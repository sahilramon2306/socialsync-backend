const responseLib=require('../libs/responseLib');
const token=require('../libs/tokenLib');
const check=require('../libs/checkLib');



// Check the user is authenticated or not.
let isAuthorized=async(req,res,next)=>{
    try{
        if(req.header('token')&& !check.isEmpty(req.header('token')))
        {
            let decoded=await token.verifyClaimWithoutSecret(req.header('token'));
            req.user=decoded.data;
            next()
        }
        else{
            let apiResponse=responseLib.generate(false,'Authorization Is Missing in Request',{})
            res.status(403).send(apiResponse)
        }
    }catch(err){
        let apiResponse=responseLib.generate(false,err.message,null)
        res.status(403).send(apiResponse)
    }
}



module.exports={
    isAuthorized:isAuthorized
}