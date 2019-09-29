const AuthGuard = require('../config/authguard');
const ElementTypeController = require('../controllers/element.type.controller');

module.exports = function(router, validateRoutes, validateAuth, validateContentType)
{
    /**
     * 
     * @api {post} /element/create Create Element Type
     * @apiName createElement
     * @apiGroup ElementType
     * @apiVersion  1.0.0
     * @apiDescription Create Element Type
     * 
     * @apiPermission create::elements
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam  (json) {String} name
     * @apiParam  (json) {String} type ModelType
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
     * }
     * 
     * @apiErrorExample {Object} Error-Response:
     * HTTP/1.1 200
     * {
     *     success : false,
     *     errorNum : 3,
     *     error : "Error to create new Element ...",
     * }
     * 
     */
    router.post('/element/create', validateAuth, validateContentType,AuthGuard.guard("create","elements"), ElementTypeController.create);
    
    /**
     * 
     * @api {patch} /element/update/:elementId Update Element
     * @apiName updateElement
     * @apiGroup ElementType
     * @apiVersion  1.0.0
     * @apiDescription Update Element Name
     * 
     * @apiPermission update::elements
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     * @apiHeader {String} content-type json *required
     * 
     * @apiParam (url) {String} :elementId (required)
     * 
     * @apiParam (json) {String} [name]
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
     *     error : "Element not found",
     * }
     * 
     */
    router.patch('/element/update/:elementId', validateAuth, validateContentType ,AuthGuard.guard("update","elements"), ElementTypeController.update);

    /**
     * 
     * @api {get} /element/view/:elementId View Element Type
     * @apiName ViewElement
     * @apiGroup ElementType
     * @apiVersion  1.0.0
     * 
     * @apiPermission read::elements
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     *   
     * @apiParam (url) {String} :elementId 
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Object} data
     * @apiSuccess (Response: 200) {String} data._id
     * @apiSuccess (Response: 200) {String} data.name
     * @apiSuccess (Response: 200) {String} data.modelType
     * @apiSuccess (Response: 200) {Number} data.status 0 = deleted, 1 = enabled
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
     *           "modelType": "category",
     *           "status" : 1,
     *           "createdAt": "2019-05-23T17:00:08.200Z",
     *           "updatedAt": "2019-05-23T17:00:08.200Z",   
     *       }
     *   }
     * 
     */
    router.get('/element/view/:elementId', validateRoutes, ElementTypeController.view);

    /**
     * 
     * @api {get} /element/list/:elementType List Element Type
     * @apiName ListElement
     * @apiGroup ElementType
     * @apiVersion  1.0.0
     * 
     * @apiPermission read::elements
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     *   
     * @apiParam (url) {String} :elementType modelType 
     * @apiParam (query) {Number} name (Use to search a specific element or list elements that the name start with xxx) 
     * @apiParam (query) {Number} limit (max 500)
     * @apiParam (query) {Number} offset (skip)
     * @apiParam (query) {String} sort <code>asc</code> or <code>desc</code>
     * 
     * @apiSuccess (Response: 200) {Boolean} success Response Status
     * @apiSuccess (Response: 200) {Object} data Array
     * @apiSuccess (Response: 200) {String} data._id
     * @apiSuccess (Response: 200) {String} data.name
     * @apiSuccess (Response: 200) {String} data.modelType
     * @apiSuccess (Response: 200) {Number} data.status 0 = deleted, 1 = enabled
     * @apiSuccess (Response: 200) {DateTime} data.createdAt (MongoDB Data Format)
     * @apiSuccess (Response: 200) {DateTime} data.updatedAt (MongoDB Data Format)
     * @apiSuccess (Response: 200) {Number} count Data Count
     * 
     * @apiSuccess (Response: 200) {Number} errorNum Error number (only if success is equal false)
     * @apiSuccess (Response: 200) {String} error Description (only if success is equal false)
     * 
     * @apiSuccessExample {Object} Success-Response:
     * HTTP/1.1 200
     * {
     *   success: true,
     *   data : 
     *       [{
     *           "_id": "3123123213",
     *           "name": "User",
     *           "modelType": "category",
     *           "status" : 1,
     *           "createdAt": "2019-05-23T17:00:08.200Z",
     *           "updatedAt": "2019-05-23T17:00:08.200Z"   
     *       }]
     *   },
     *   count : 1
     * 
     */
    router.get('/element/list/:elementType', validateRoutes, ElementTypeController.list);

    /**
     * 
     * @api {delete} /element/delete/:elementId Delete Element Type
     * @apiName DeleteElement
     * @apiGroup ElementType
     * @apiVersion  1.0.0
     * 
     * @apiPermission delete::elements
     * 
     * @apiHeader {String} x-web-access-token Web Token to start requests
     * @apiHeader {String} Authorization JWT Token (ex: Bearer token)
     *   
     * @apiParam (url) {String} :elementId 
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
    router.delete('/element/delete/:elementId', validateAuth,AuthGuard.guard("delete","elements"), ElementTypeController.delete);
}