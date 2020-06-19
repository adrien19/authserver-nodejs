const models = require('./auth-api/server/src/models');
const User = models.User;

User.bulkCreate([
  {email: 'john-doe@domain.com', username: 'John.doe', password: 'John.doe', firstname: 'John',  lastname: 'DOE', role: ['user','admin']},
  {email: 'log_w@domain.com', username: 'John.wolverine', password: 'John.doe', firstname: 'Logan',  lastname: 'WOLVERINE', role: ['user']},
  {email: 'john-connor@domain.com', username: 'John.connor', password: 'John.doe', firstname: 'John',  lastname: 'CONNOR', role: ['user']}
])
.then((newUsers) => {
  console.log(newUsers)
})
.catch((err) => {
  console.log("Error while users creation : ", err)  
})
