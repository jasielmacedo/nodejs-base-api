
const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

module.exports = function(app, passport)
{
    const validateRoutes = [
        AuthController.validateRoutes
    ]; 

    const validateAuth = [
        AuthController.validateRoutes,
        AuthController.validateSession,
        passport.authenticate('jwt-strategy', {session:true}),
        
    ];
    
    const validateContentType = [
        AuthController.validateContentType,
    ];


    // user routes
    require('./user.routes')(router,validateRoutes,validateAuth, validateContentType);

    // auth routes
    require('./auth.routes')(router,validateRoutes,validateAuth, validateContentType);

    // push routes
    require('./push.routes')(router,validateRoutes,validateAuth, validateContentType);

    // general element type routes
    require('./element.type.routes')(router,validateRoutes,validateAuth, validateContentType);

    /**
     * 
     * @api {get} /health To check if API is Online and running
     * @apiName Health
     * @apiGroup Status
     * @apiVersion  1.0.0
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * 
     * @apiSuccess (Response: 200) {Boolean} success returns true if everything is ok
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true
     * }
     */
    router.get('/health',validateRoutes, AuthController.healthCheck);
    
    app.use('/v1', router);
    app.use(AuthController.validateRoutes);  
    app.use(AuthController.denyRoutes);  
}