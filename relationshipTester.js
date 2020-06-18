const models = require('./auth-api/server/src/models');
const User = models.User;
const Token = models.Token;

User.bulkCreate([
    {email: 'john-doe@domain.com', firstName: 'John',  lastName: 'DOE'},
    {email: 'log_w@domain.com', firstName: 'Logan',  lastName: 'WOLVERINE'},
    {email: 'john-connor@domain.com', firstName: 'John',  lastName: 'CONNOR'}
  ])
  .then((newUsers) => {
    console.log(newUsers)
  })
  .catch((err) => {
    console.log("Error while users creation : ", err)
})

Token.bulkCreate([
    {userId: 1, token: 'Johnahdfaodfhbeoufqwoefad'},
    {userId: 2, token: 'Loganaifjaifaofih89efnoei'},
    {userId: 3, token: 'Johniuhffgsyudfsuifyefgey'}
  ])
  .then((newTokens) => {
    console.log(newTokens)
  })
  .catch((err) => {
    console.log("Error while newTokens creation : ", err)
})