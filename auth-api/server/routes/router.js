const verifySignUp = require('../services/verifySignUp.service');
const authJwt = require('../services/verifyJwtToken.service');
 
module.exports = function(app) {
 
    const authController = require('../controllers/auth.controller.js');
 
  app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], authController.signup);
  
  app.post('/api/auth/signin', authController.signin);

  app.post('/api/auth/logout', authController.revokeRefreshToken);

  app.post('/api/auth/refreshtoken', authController.refreshUserToken); 
  
  app.get('/api/content/user', [authJwt.verifyToken], authController.userContent);
  
  app.get('/api/content/pm', [authJwt.verifyToken, authJwt.isPmOrAdmin], authController.managementBoard);
  
  app.get('/api/content/admin', [authJwt.verifyToken, authJwt.isAdmin], authController.adminBoard);
}