const jwt = require("jsonwebtoken");
import dotenv from "dotenv"
dotenv.config()

const makeToken =(payload:{})=>{
    var token = jwt.sign(
        {
            ...payload ,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, 
        },
        process.env.SECRET_KEY
    );
    return token
}

const verifyJWT = ({token}: {token: string})=>{
    console.log("token====>",token);
    const vrt = jwt.verify(token, process.env.SECRET_KEY);
    return vrt
}

module.exports = {
    makeToken,
    verifyJWT
}