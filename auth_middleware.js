const jwt = require("jsonwebtoken");
const Secretkey = process.env.Secretkey;


const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
    }
    
    try {
        const decoded = jwt.verify(token,Secretkey);
        req.user = {userId : decoded.userId , isAdmin : decoded.isAdmin};
        next();
    } catch (error) {
          return res.status(500).json({ message: error });
    } 
  };

  const checkAdmin = async(req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
    }
    try {
        const decoded = jwt.verify(token,Secretkey)
        const isAdmin = decoded.isAdmin;
        if(!isAdmin)
        {
            return res.status(401).json({msg:"Only Authorized by Admin"});
        }
        next();
        
    } catch (error) {
        return res.status(500).json({ message: error });
    }

  }

  const validateUserid = async(req,res,next)=>{
    const userid = req.params.userid;
    if(!userid)
    {
        return res.status(400).json({msg:"Invalid userId"});
    }
    req.userId = userid;
    next();
}

module.exports = {authenticateUser,checkAdmin,validateUserid};