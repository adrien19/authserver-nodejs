const models = require('./auth-api/server/src/models');
const User = models.User;


  User.findOne({
    where: {
      username: 'John.doe'
    } 
  }).then(user => {
    if(user){
      console.log("Fail -> Username is already taken!");
      return;
    }
    
    // -> Check Email is already in use
    User.findOne({ 
      where: {
        email: 'john-doe@domain.com'
      } 
    }).then(user => {
      if(user){
        console.log("Fail -> Email is already in use!");
        return;
      }
    });
  }).catch( err => {
    console.log("=================== FAILED TO GET THE USER ============== Error -> " + err);
  })