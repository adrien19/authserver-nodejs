const jwt = require('jsonwebtoken');
require('dotenv').config();
const models = require('../src/models');

const Role = models.Role;
const User = models.User;
 
verifyToken = (req, res, next) => {  
  const providedId = req.body.id;

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token){
    return res.status(403).send({ 
      auth: false, message: 'No token provided.' 
    });
  }
 
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err){
      return res.status(500).send({ 
          auth: false, 
          message: 'Fail to Authentication. Error -> ' + err 
        });
    }
    if (providedId) {
      req.userId = providedId;

      next();
    }else {
      req.userId = decoded.id;
      next();
    }
  });
}
 
isAdmin = (req, res, next) => {
  User.findOne({ where: {id: req.userId }})
    .then(user => {
      user.getRoles().then(roles => {
        for(let i=0; i<roles.length; i++){
          console.log(roles[i].name);
          if(roles[i].name.toUpperCase() === "ADMIN"){
            next();
            return;
          }
        }
        
        res.status(403).send("Require Admin Role!");
        return;
      })
  })
}
 
isPmOrAdmin = (req, res, next) => {
  
  User.findOne({ where: {id: req.userId }})
    .then(user => {
      user.getRoles().then(roles => {
        for(let i=0; i<roles.length; i++){          
          if(roles[i].name.toUpperCase() === "PM"){
            next();
            return;
          }
          
          if(roles[i].name.toUpperCase() === "ADMIN"){
            next();
            return;
          }
        }
        
        res.status(403).send("Require PM or Admin Roles!");
      })
    })
}
 
const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;
authJwt.isPmOrAdmin = isPmOrAdmin;
 
module.exports = authJwt;