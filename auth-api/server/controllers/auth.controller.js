
require('dotenv').config();

const models = require('../src/models');

const User = models.User;
const Role = models.Role;
const Token = models.Token;
 
const Op = models.Sequelize.Op;
 
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
 
exports.signup = (req, res) => {
  // Save User to Database
  console.log("Processing func -> SignUp");
  
  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12)
  }).then(user => {
    Role.findAll({
      where: {
      name: {
        [Op.or]: req.body.roles
      }
      }
    }).then(roles => {
      user.setRoles(roles).then(() => {
        res.send("User registered successfully!");
            });
    }).catch(err => {
      res.status(500).send("Error -> " + err);
    });
  }).catch(err => {
    res.status(500).send("Fail! Error -> " + err);
  })
}
 
exports.signin = (req, res) => {
  console.log("Sign-In");

  User.findOne({
    where: {
      username: req.body.username
    },
    // attributes: ['firstname', 'lastname', 'username', 'email'],
    include: [{
      model: Role,
      attributes: ['id', 'name'],
      through: {
        attributes: [],
      }
    }]
  }).then(user => {
    if (!user) {
      return res.status(404).send('User Not Found.');
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
    }
    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      roles: user.Roles
    }

    var newToken = generateAccessToken(user.id, user.Roles)

    const refreshToken = jwt.sign({ id: user.id, roles: user.Roles }, process.env.REFRESH_SECRET_KEY, {
      // expiresIn: '2d' // expires in 24 hours
    })
    
    // save token of user
    Token.findOne({
      where: {
        userId: user.id
      }
    }).then(token => {
      if (!token) {
        Token.create({
          userId: user.id,
          token: refreshToken
        }).catch(err => {
          res.status(500).send('########################## ARROR ACCURRED WHILE SAVING TOKEN #############' + err);
        });
      }else{
        Token.update({
          token: refreshToken
        }, { where: { userId: user.id}}).catch(err => {
          res.status(500).send('########################## THERE WAS AN ARROR SAVING TOKEN #############' + err);
        });
      }
    })    
    return res.status(200).send({ userInfo: userInfo, auth: true, accessToken: newToken , refreshToken: refreshToken });
    
  }).catch(err => {
    res.status(500).send('Error -> ' + err);
  });
}

exports.refreshUserToken = (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken === null) {return res.sendStatus(401)}

  Token.findOne({
    where: {
      token: refreshToken
    }
  }).then(token => {
    if (!token) {
      res.sendStatus(401)
    }else {

      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, id, roles) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken(id, roles)
        res.json({ accessToken: accessToken })
      })
    }
  })
}


exports.revokeRefreshToken = (req, res) => {
  const refreshToken = req.body.token

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, userInfo) => {
    Token.findOne({
      where: {
        userId: parseInt(userInfo.id, 10)
      }
    }).then(token => {
      if (token) {
        console.table({message: "GOIGN TO DESTROY TOKEN"});

        Token.destroy({
          where: {
            id: token.id
          }
        }).then(
          res.sendStatus(200).send('Successfully logged out!')
        ).catch(err => {
          throw(err)
        });
      }

      res.sendStatus(204) // No token was found!!

      }).catch(err => {
      res.sendStatus(500)
    });
  })
}

function generateAccessToken(id, roles) {
  return jwt.sign({ id: id, roles: roles}, process.env.SECRET_KEY, {
    expiresIn: '30m' // expires in 1 hour
  })
}


/**
 * Below for testing the API
 */
 
exports.userContent = (req, res) => {
  User.findOne({
    where: {id: req.userId},
    attributes: ['id', 'firstname', 'lastname', 'username', 'email'],
    include: [{
      model: Role,
      attributes: ['id', 'name'],
      through: {
        attributes: [],
      }
    }]
  }).then(user => {
    res.status(200).json({
      "description": "User Content Page",
      "user": user
    });
  }).catch(err => {
    res.status(500).json({
      "description": "Can not access User Page",
      "error": err
    });
  })
} 

exports.multiUsersContent = (req, res) => {
  User.findAll({
    where: {
      id: {
        [Op.in]: req.body.userIds
      }
    },
    attributes: ['id', 'firstname', 'lastname', 'username', 'email']
  }).then(users => {
    res.status(200).json({
      "description": "User Content Page",
      "users": users
    });
  }).catch(err => {
    res.status(500).json({
      "description": "Can not access User Page",
      "error": err
    });
  })
}
 
exports.adminBoard = (req, res) => {
  User.findOne({
    where: {id: req.userId},
    attributes: ['firstname', 'lastname', 'username', 'email'],
    include: [{
      model: Role,
      attributes: ['id', 'name'],
      through: {
        attributes: [],
      }
    }]
  }).then(user => {
    User.findAll({
      where: {id: { [Op.ne]: req.userId }},
      attributes: ['firstname', 'lastname', 'username', 'email'],
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        }
      }]
    }).then(users => {
      if (users) {
        res.status(200).json({
          "description": "Admin Board",
          "currentAdmin": user,
          "users": users
        });
      }else{
        res.status(200).json({
          "description": "Admin Board",
          "currentAdmin": user,
          "users": 'No users found to show!'
        });
      }
    })
  }).catch(err => {
    res.status(500).json({
      "description": "Can not access Admin Board",
      "error": err
    });
  })
}
 
exports.managementBoard = (req, res) => {
  User.findOne({
    where: {id: req.userId},
    attributes: ['firstname', 'lastname', 'username', 'email'],
    include: [{
      model: Role,
      attributes: ['id', 'name'],
      through: {
        attributes: [],
      }
    }]
  }).then(user => {
    User.findAll({
      where: {id: { [Op.ne]: req.userId }},
      attributes: ['firstname', 'lastname', 'username', 'email'],
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        }
      }]
    }).then(users => {
      if (users) {
        res.status(200).json({
          "description": "Management Board",
          "currentManager": user,
          "users": users
        });
      }else{
        res.status(200).json({
          "description": "Management Board",
          "currentManager": user,
          "users": 'No users found to show!'
        });
      }
    })
  }).catch(err => {
    res.status(500).json({
      "description": "Can not access Management Board",
      "error": err
    });
  })
}