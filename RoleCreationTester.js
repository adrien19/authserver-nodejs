const models = require('./auth-api/server/src/models');
const Role = models.Role;



Role.bulkCreate([
  {name: 'USER'},
  {name:'ADMIN'},
  {name:'PM'}
]) 
.then((newRoles) => {
  console.log(newRoles)
})
.catch((err) => {
  console.log("Error while newRoles creation : ", err)
})