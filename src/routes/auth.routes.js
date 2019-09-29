const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/users.controller');
const AuthGuard = require('../config/authguard');

module.exports = function(router, validateRoutes, validateAuth, validateContentType)
{
    /**
     * 
     * @api {post} /auth/login Login
     * @apiName Login
     * @apiGroup Authentication
     * @apiVersion  1.0.0
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam  {String} email 
     * @apiParam  {String} password
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status 
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data.id User Id
     * @apiSuccess (Response: 200) {String} data.token JWT Token
     * @apiSuccess (Response: 200) {Number} data.expireAt
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     *  
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true,
     *     userId : "111223",
     *     token : "adsadafsda123...",
     *     expireAt : 554123123
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * HTTP/1.1 200
     * {
     *     success : false,
     *     errorNum : 1,
     *     error : "Usuario e senha invalidos",
     * }
     * 
     */
    router.post('/auth/login', validateRoutes, validateContentType ,AuthController.login);

    /**
     * 
     * @api {post} /auth/logout Logout
     * @apiName Logout
     * @apiGroup Authentication
     * @apiVersion  1.0.0
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true,
     * }
     * 
     */
    router.post('/auth/logout', validateAuth,AuthController.logout);

    /**
     * 
     * @api {get} /auth/loggedIn User Logged In
     * @apiName LoggedIn
     * @apiGroup Authentication
     * @apiVersion  1.0.0
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * 
     * @apiPermission read::self:user
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status 
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data.id
     * @apiSuccess (Response: 200) {String} data.name
     * @apiSuccess (Response: 200) {String} data.email
     * @apiSuccess (Response: 200) {String} data.role
     * 
     * @apiSuccess (Error: 4xx) {Empty} No-response
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
        success: true,
            data: 
                {
                    "id": "3123123213",
                    "name": "User",
                    "email": "user@base.com",
                },
            "role": "admin"
        }
     * 
     */
    router.get('/auth/loggedIn', validateAuth, UserController.getLoggedUser);


    // creating array without jwt validation
    validateOnlySessionAndRoute = [
        validateAuth[0],
        validateAuth[1]
    ]

    /**
     * 
     * @api {get} /auth/renewAccessToken/ Renew Access Token
     * @apiName RenewAccessToken
     * @apiGroup Authentication
     * @apiVersion  1.0.0
     * @apiDescription This Request will renew the JWT Token for the logged user.
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status 
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data.id User Id
     * @apiSuccess (Response: 200) {String} data.token JWT Token
     * @apiSuccess (Response: 200) {Number} data.expireAt
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     * 
     * 
     * @apiSuccess (Error: 4xx) {Empty} No-response if the user is not logged anymore.
     * 
     *  
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true,
     *     userId : "111223",
     *     token : "adsadafsda123...",
     *     expireAt : 554123123
     * }
     * 
     * 
     */
    router.get('/auth/renewAccessToken/', validateOnlySessionAndRoute,AuthController.renewAccessToken);
}