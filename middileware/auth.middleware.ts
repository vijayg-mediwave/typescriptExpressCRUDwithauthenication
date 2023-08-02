const { verifyJWT } = require("../utils");

const checkForUser = (req:any,res:any,next:any)=>{
    const authHeader = req.headers["authorization"];
 
  if (!authHeader) {
    return res.status(403).send({
      message: "unaythorised: user id not found",
    });
  }

  const authSplit = authHeader.split(" ");
  
  if (authSplit.length != 2) {
    return res.status(403).send({
    
      message: "unaythorised: user id is in invalid format",
    });
  }

   const token = authSplit[1];
   
  try {
    const jwtPayload = verifyJWT({token});
    const userId = jwtPayload.user;
    res.locals.user = userId;
    next();
  } catch (error) {
    next(error);
  }

}

module.exports ={ 
    checkForUser
}