const jwt =require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken=(token)=>{
    try{
        //const token=req.headers.authorization.split(" ")[1];
        const decode =jwt.verify(token, process.env.JWT_KEY);
        //req.getToken = decode;
        //console.log("Decode "+decode);
        //console.log("token "+token);
        return decode;
    }
    catch(err){
        return null;
    }
}