const Debug = require('debug')('user:controller');
var response = require('../helpers/response.helpers');
var validation = require('../helpers/validation.helpers');
var User = require('../models/user.model');
var UserAuthentication = require('../models/user.authentication.model');
const uuid = require('uuid/v1');

exports.create = function(req, res) 
{
    var {name,email,token,type,role} = req.body;

    if((name == undefined || name == null) || 
       (email == undefined || email == null) ||
       (token == undefined || token == null) ||
       (type == undefined || type == null) ||
       (role == undefined || role == null))
    {
        return response.json(res,400,{
            success : false,
            errorNum : 0,
            error: "Invalid params"
        });
    }

    if(!validation.isEmail(email))
    {
        return response.json(res,200,{
            success : false,
            errorNum : 1,
            error: "Invalid email"
        });
    }

    var typeLogin = "local-login";
    switch(type)
    {
        case "facebook": typeLogin = "facebook"; break;
        case "twitter": typeLogin = "twitter"; break;
        case "google": typeLogin = "google"; break;
        default: 
            typeLogin = "local-login";
        break;
    }

    var typeRole = "user";
    switch(role)
    {
        case "editor": typeRole = "editor"; break;
        case "admin": typeRole = "admin"; break;
        default: 
            typeRole = "user";
        break;
    }

    const user = new User({
        name : name,
        email : email,
        status : 1,
        activationCode : uuid()
    });

    user.save().then((data) => 
    {
        const userAuth = new UserAuthentication({
            userId : data._id,
            type: typeLogin
        });

        userAuth.token = typeLogin=='local-login'?userAuth.cryptPassword(token):token;

        userAuth.save().then((pass) => 
        {
            req.acl.addUserRoles(data._id.toString(),typeRole);

            return response.json(res,200,{
                success : true,
                data : {
                    id : data._id
                }
            });
        }).catch((passErr) => {
            Debug(passErr);
            return response.json(res,200,{
                success: false,
                errorNum : 4,
                error : passErr.message || 'Error to create new User Authentication'
            });
        });        
    }).catch((err) => {
        Debug(err);
        return response.json(res,200,{
            success: false,
            errorNum : 3,
            error : err.message || 'Error to create new User'
        });
    });
}

exports.update = function(req, res) 
{
    var {name,email} = req.body;

    if((email == undefined || email == null) && 
        (name == undefined || name == null))
    {
        return response.json(res,200,{
            success : false,
            errorNum : 0,
            error: "Invalid params"
        });
    }

    if((email != undefined && email != null) && !validation.isEmail(email))
    {
        return response.json(res,200,{
            success : false,
            errorNum : 0,
            error: "Invalid Email"
        });
    }

    var userId = req.params.userId || req.session.user._id;

    if(!userId)
    {
        return response.json(res,200,{
            success:false,
            errorNum : 10,
            error:"Invalid user"
        });
    }

    User.findOne({
        _id: userId
    }).then((user) => {
        
        user.name = name || user.name;
        user.email = email || user.email;

        user.save(function(errUser)
        {
            if(errUser)
            {
                return response.json(res,200,{
                    success:false,
                    errorNum : 5,
                    errors: errUser.errors
                });
            }else
            {
                return response.json(res,200,{
                    success:true,
                    userId : userId
                });
            }
        });
    }).catch((err) => {
        Debug(err);
        if(err.kind === 'ObjectId')
        {
            return response.json(res,200,{
                'success':false,
                errorNum : 6,
                'error':'user not found'
            });
        }
        return response.json(res,200,
        {
            'success':false,
            errorNum : 7,
            'error':'Error trying to find the user'
        });
    });
}

exports.updateRole = function(req, res)
{
    var {role} = req.body;

    if((role == undefined || role == null))
    {
        return response.json(res,400,{
            success : false,
            errorNum : 0,
            error: "Invalid params"
        });
    }

    var typeRole = "gamer";
    switch(role)
    {
        case "gamer": typeRole = "gamer"; break;
        case "admin": typeRole = "admin"; break;
        case "trainer": typeRole = "trainer"; break;
        default: 
            typeRole = "user";
        break;
    }

    var userId = req.params.userId;

    if(!userId)
    {
        return response.json(res,200,{
            success:false,
            errorNum : 10,
            error:"Invalid user"
        });
    }

    User.findOne({
        _id: userId
    }).then((user) => 
    {
        req.acl.userRoles(user._id, (err, roles) => 
        {
            req.acl.removeUserRoles(user._id,roles);
        });

        req.acl.addUserRoles(data._id.toString(),typeRole);

        return response.json(res,200,{
            success:true,
            userId : userId
        });

    }).catch((err) => {
        if(err.kind === 'ObjectId')
        {
            return response.json(res,200,{
                'success':false,
                errorNum : 6,
                'error':'user not found'
            });
        }
        return response.json(res,200,
        {
            'success':false,
            errorNum : 7,
            'error':'Error trying to find the user'
        });
    });
}

exports.updatePassword = function(req, res)
{
    var {oldtoken, token} = req.body;
    if(token === undefined || token === null || oldtoken === undefined || oldtoken === null)
    {
        return response.json(res,400,{
            success:false,
            errorNum : 0,
            error:"Invalid password"
        });
    }

    var userId = req.params.userId || req.session.user._id;

    if(!userId)
    {
        return response.json(res,200,{
            success:false,
            errorNum : 10,
            error:"Invalid user"
        });
    }

    UserAuthentication.findOne({
        userId: userId
    }).then((pass) => {
        
        if(!pass)
        {
            return response.json(res,200,{
                success:false,
                errorNum : 2,
                error:"You can't change the password for this type of authentication"
            });
        }

        if(pass.type != "local-login")
        {
            return response.json(res,200,{
                success:false,
                errorNum : 3,
                error:"You can't change the password for this type of authentication"
            });
        }

        if(!pass.validPassword(oldtoken))
        {
            return response.json(res,200,{
                success:false,
                errorNum : 4,
                error:"old password is not valid"
            });
        }

        pass.token = pass.cryptPassword(token);
        pass.save(function(errPass)
        {
            if(errPass)
            {
                return response.json(res,200,{
                    success:false,
                    errorNum : 5,
                    errors: errPass.errors
                });
            }else
            {
                return response.json(res,200,{
                    success:true,
                    data : {
                        id : userId
                    }
                });
            }
        });
    }).catch((err) => {
        if(err.kind === 'userId')
        {
            return response.json(res,200,{
                'success':false,
                errorNum : 6,
                'error':'user not found'
            });
        }
        return response.json(res,200,
        {
            'success':false,
            errorNum : 7,
            'error':'Error trying to find the user'
        });
    });
}

exports.view = function(req, res) 
{
    var userId = req.params.userId;

    User.findOne({
        _id: userId
        }).then(user => {
            if(!user)
            {
                return response.json(res,200,{success:false, errorNum : 0,error:'user not found'});
            }else{
                return response.json(res,200,{
                    'success':true,
                    'data':user
                });
            }
        }).catch(err => {
            if(err.kind === 'ObjectId')
            {
                return response.json(res,200,{success:false,errorNum : 1,error:'user not found'});
            }
            return response.json(res,200,{success:false,errorNum : 2,error:'Error trying to find the user'});
        });
}

exports.viewAll = function(req, res) 
{
    var limit =  req.query.limit || 50;
    var skip = req.query.offset || 0;
    var sort = req.query.sort && req.query.sort.toLowerCase() == 'asc'?1:-1;
    var name = req.query.name || null;

    limit = parseInt(limit);
    if(limit == NaN)
        limit = 50;

    skip = parseInt(skip);
    if(skip == NaN)
        skip = 0;

    if(limit > 200)
        limit = 200;

    var args = [
        {
            $match : {
                status : 1
            }
        },
        {
            $sort: {
                "createdAt": sort,               
            }
        },
        {  $skip : skip },
        {  $limit : limit }
    ];

    if(name != null && name != undefined)
    {
        args[0].$match.name = {
            $regex: name 
        };
    }

    User.aggregate(args)
        .then(users => {
            if(!users)
            {
                return response.json(res,200,{success:false, errorNum : 0,error:'user not found'});
            }else{
                return response.json(res,200,{
                     'success':true,
                     'data': users
                });
            }
        }).catch(err => {
            return response.json(res,200,{success:false,errorNum : 2,error:'Error trying to find the user'});
        });
}

exports.getLoggedUser = function(req, res) 
{
    if(!req.session.user || !req.session.user._id)
    {
        return response.json(res,200,{success:false,errorNum : 10,error:"Invalid user"});
    }

    var userId = req.session.user._id;

    User.findOne({
        _id: userId
        }).then(user => {
            if(!user)
            {
                return response.json(res,200,{success:false, errorNum : 0,error:'user not found'});
            }else{
                userRoles(req, res, user);
            }
        }).catch(err => {
            if(err.kind === 'ObjectId')
            {
                return response.json(res,200,{success:false,errorNum : 1,error:'user not found'});
            }
            return response.json(res,200,{success:false,errorNum : 2,error:'Error trying to find the user'});
        });
}

exports.remove = function(req, res) 
{
    User.findOneAndUpdate({
        _id: req.params.userId
    },{
        status: 2
    }, {new: true}).then((data) => {
        if(!data){
            return response.json(res,200,{
                success : false,
                errorNum : 0,
                error: "Error trying to retrieve the info"
            });
        }
        return response.json(res,200,{
            success : true
        });
    }).catch((err) => {
        if(err.kind === 'ObjectId')
        {
            return response.json(res,200,{
                success:false,
                errorNum : 1,
                error:'User not found'
            });
        }

        return response.json(res,200,{
            success : false,
            errorNum : 2,
            error : err.message || "User not found"
        });
    });
}

userRoles = function(req, res, user)
{
    var userId = user._id;
    var role = '';
    userId = userId.toString();

    req.acl.userRoles(userId, (error, allowed) => {
        role = allowed;
        if(allowed)
            return res.status(200).send({
                success:true,
                data : {
                    user: user,
                    role: role[0]
                }
            });
        else
            return res.status(200).send({success:false});
    });
}

roles = function(req, res, role, user)
{
    role = role.toString();
    req.acl.whatResources(role,function(err,resources){ 
        if(resources)
            return res.status(200).send({
                success:true,
                user: user,
                role: role, 
                permissions: resources
            });
        else
            return res.status(200).send({success:false});
    }); 
}