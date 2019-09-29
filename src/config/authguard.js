const permissions = require('./permissions');

exports.guard = function(resource, action)
{
   return function(req, res, next)
   {
        var userId = req.session.user._id;
        if(userId)
        {
            userId = userId.toString();
            req.acl.isAllowed(userId,resource,action,(error, allowed) => {
                if(allowed)
                    next();
                else
                    return res.status(200).send({success:false});
            });
        }else{
            return res.status(200).send({success:false});
        }
   };
}

exports.checkIsAllowed = function(req, userId, resource, action)
{
    return new Promise( (resolve,reject) =>{
        if(userId)
        {
            userId = userId.toString();
            req.acl.isAllowed(userId,resource,action,(error, allowed) => {
                if(allowed)
                    resolve(true);
                else
                    reject(null);
            });
        }else{
            reject(null);
        }
    });
}

exports.createPermissions = function(acl)
{
    acl.allow(permissions);
    //Every user is allowed to do what guests do
    acl.addRoleParents( 'user', 'guest' );
}