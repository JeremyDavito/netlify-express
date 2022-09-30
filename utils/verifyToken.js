const jwt = require('jsonwebtoken');
const errorUtils = require("./errors.utils") ;


const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
 
  //console.log (req.cookies)
  if (!token) {
    return next(errorUtils.createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return next(errorUtils.createError(403, "Token is not valid!"));
    console.log(user.isAdmin)
    req.user = user;

    console.log(user)
    next();
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const verifyAdmin = (req, res, next) => {

  const token = req.cookies.jwt;
 
  //console.log (req.cookies)
  if (!token) {
    return next(errorUtils.createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return next(errorUtils.createError(403, "Token is not valid!"));
    //console.log(user.isAdmin)
    

    console.log(user.isAdmin)

    if (user.isAdmin ) {
     
      
      next();
    } else {
      
      return next(errorUtils.createError(403, "You are not authorized!"));
    }

    console.log(user)
    //next();
  });
};


module.exports = verifyAdmin;