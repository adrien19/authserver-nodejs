
require('dotenv').config();
const models = require('../src/models');

const ROLEs = process.env.ROLEs; 
const User = models.User;
const Role = models.Role;
 
checkDuplicateUserNameOrEmail = (req, res, next) => {
  // -> Check Username is already in use
   
  User.findOne({
    where: {
      username: req.body.username
    } 
  }).then(user => {
    if(user){
      res.status(400).send("Fail -> Username is already taken!");
      return;
    }
    
    // -> Check Email is already in use
    User.findOne({ 
      where: {
        email: req.body.email
      } 
    }).then(user => {
      if(user){
        res.status(400).send("Fail -> Email is already in use!");
        return;
      }
      next();
    });
  }).catch( err => {
    res.status(500).send(err);
  });
}
 
checkRolesExisted = (req, res, next) => {  
  for(let i=0; i<req.body.roles.length; i++){
    if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
      res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);
      return;
    }
  }
  next();
}
 
const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;
 
module.exports = signUpVerify;