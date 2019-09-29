const UserController = require('../controllers/users.controller');
const AuthGuard = require('../config/authguard');

module.exports = function(router, validateRoutes, validateAuth,validateContentType)
{
    /**
     * 
     * @api {post} /user/changepass Change Pass
     * @apiName ChangePass
     * @apiGroup User
     * @apiVersion  1.0.0
     * @apiDescription Change the password only for the logged User
     * 
     * @apiPermission update::self:user
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam  (json) {String} token New password
     * @apiParam  (json) {String} oldtoken Old Password
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true,
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * HTTP/1.1 200
     * {
     *     success : false,
     *     errorNum : 1,
     *     error : "Old password not match",
     * }
     * 
     */
    router.post('/user/changepass', validateAuth,validateContentType,AuthGuard.guard("update","self:user"),UserController.updatePassword);
    
    /**
     * 
     * @api {post} /user/changepass/:userId Change Pass By User
     * @apiName ChangePassByUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * @apiDescription Change the password for the selected user
     * 
     * @apiPermission update::user
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam (url) {String} userId
     * @apiParam (json) {String} token New password
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true,
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * {
     *     success : false,
     *     errorNum : 1,
     *     error : "Old password not match",
     * }
     * 
     */
    router.post('/user/changepass/:userId', validateAuth,validateContentType, AuthGuard.guard("update","user"),UserController.updatePassword);

    /**
     * 
     * @api {post} /user/updaterole/:userId Change Role By User
     * @apiName ChangeRoleByUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * @apiDescription Change the role of the user indicated by ID
     * 
     * @apiPermission update::users:role
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam (url) {String} userId
     * @apiParam (json) {String} role Permission <code>admin</code>,<code>editor</code>
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true,
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * HTTP/1.1 200
     * {
     *     success : false,
     *     errorNum : 10,
     *     error : "User not found",
     * }
     * 
     */
    router.post('/user/updaterole/:userId', validateAuth,validateContentType, AuthGuard.guard("update","users:role"),UserController.updateRole);


    /**
     * 
     * @api {get} /user/view/:userId View User
     * @apiName ViewUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     * @apiPermission read::users
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     *   
     * @apiParam (url) {String} :userId 
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data._id
     * @apiSuccess (Response: 200) {String} data.name
     * @apiSuccess (Response: 200) {String} data.email
     * @apiSuccess (Response: 200) {String} data.username
     * @apiSuccess (Response: 200) {Number} data.status 0 = disabled, 1 = enabled, 2 = deleted
     * @apiSuccess (Response: 200) {DateTime} data.createdAt (MongoDB Data Format)
     * @apiSuccess (Response: 200) {DateTime} data.updatedAt (MongoDB Data Format)
     * 
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *   success: true,
     *   data : 
     *       {
     *           "_id": "3123123213",
     *           "name": "User",
     *           "email": "user@base.com",
     *           "username": "user123",
     *           "status" : 1,
     *           "createdAt": "2019-05-23T17:00:08.200Z",
     *           "updatedAt": "2019-05-23T17:00:08.200Z",   
     *       }
     *   }
     * 
     */
    router.get('/user/view/:userId',validateAuth,AuthGuard.guard("read","users"), UserController.view);

    
    /**
     * 
     * @api {get} /user/list List All User
     * @apiName ListAllUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     * @apiPermission read::users
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     *  
     * @apiParam (query) {Number} name (Use to search a specific user or list users that the name start with xxx) 
     * @apiParam (query) {Number} limit (max 500)
     * @apiParam (query) {Number} offset (skip)
     * @apiParam (query) {String} sort <code>asc</code> or <code>desc</code>
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Object} data Array
     * @apiSuccess (Response: 200) {String} data._id
     * @apiSuccess (Response: 200) {String} data.name
     * @apiSuccess (Response: 200) {String} data.email
     * @apiSuccess (Response: 200) {String} data.username
     * @apiSuccess (Response: 200) {Number} data.status 0 = disabled, 1 = enabled, 2 = deleted
     * @apiSuccess (Response: 200) {DateTime} user.createdAt (MongoDB Data Format)
     * @apiSuccess (Response: 200) {DateTime} user.updatedAt (MongoDB Data Format)
     * 
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false) 
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *   success: true,
     *   data: 
     *       [{
     *           "_id": "3123123213",
     *           "name": "User",
     *           "email": "user@base.com",
     *           "username": "user123",
     *           "status" : 1,
     *           "createdAt": "2019-05-23T17:00:08.200Z",
     *           "updatedAt": "2019-05-23T17:00:08.200Z",   
     *       }]
     *   }
     * 
     */
    router.get('/user/list',validateAuth,AuthGuard.guard("read","users"), UserController.viewAll);
    

    /**
     * 
     * @api {post} /user/create Create User
     * @apiName createUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * @apiDescription Create users
     * 
     * @apiPermission create::users
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam  {String} name
     * @apiParam  {String} email (unique)
     * @apiParam  {String} token Password
     * @apiParam  {String} type Login Type <code>local-login</code>,<code>google</code>,<code>facebook</code>
     * @apiParam  {String} role Permission Group <code>admin</code>,<code>editor</code>
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data.id 
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)  
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true
     *     id : "hasdasdas",
     *     hash : "12312asdasd123"
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * HTTP/1.1 200
     * {
     *     success : false,
     *     errorNum : 3,
     *     error : "Error to create new User",
     * }
     * 
     */
    router.post('/user/create',validateAuth,validateContentType,AuthGuard.guard("create","users"), UserController.create);
    

    /**
     * 
     * @api {patch} /user/update/:userId Update User
     * @apiName updateUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * @apiDescription Update users. At least one parameter needs to be sended
     * 
     * @apiPermission update::users
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam (url) {String} :userId (required)
     * 
     * @apiParam (json) {String} [name] optional
     * @apiParam (json) {String} [email] optional (unique)
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data.id 
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false) 
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *     success : true
     *     data { id : "hasdasdas" }
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * HTTP/1.1 200
     * {
     *     success : false,
     *     errorNum : 6,
     *     error : "user not found",
     * }
     * 
     */
    router.patch('/user/update/:userId',validateAuth,validateContentType,AuthGuard.guard("update","users"), UserController.update);

    /**
     * 
     * @api {delete} /user/delete/:userId Delete User
     * @apiName DeleteUser
     * @apiGroup User
     * @apiVersion  1.0.0
     * 
     * @apiPermission delete::users
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     *   
     * @apiParam (url) {String} :userId 
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *   success: true
     * }
     * 
     */
    router.delete('/user/delete/:userId',validateAuth,AuthGuard.guard("delete","users"), UserController.remove);
}