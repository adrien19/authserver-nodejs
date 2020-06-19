const models = require('./auth-api/server/src/models');
const Token = models.Token;
 
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