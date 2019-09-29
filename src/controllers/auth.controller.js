const Debug = require('debug')('auth:controller');
const response = require('../helpers/response.helpers');
const jwt = require('jsonwebtoken');
const constants = require('../config/constants');
const User = require('../models/user.model');
const passport = require('passport');
const uuid = require('uuid/v1');

exports.healthCheck = function(req, res)
{
    res.status(200).send({success:true});
}

exports.validateRoutes = function(req, res, next)
{
    var webtoken = req.headers['x-web-access-token'];
    if(!webtoken || webtoken != constants.webtoken)
        res.status(403).send("");
    else
        next();
}

exports.validateContentType = function(req, res, next)
{
    var contentType = req.headers['content-type'];
    if(!contentType || contentType.toLowerCase() != "application/json")
        return response.json(res,400,{success:false,error : 'Content-type is not json'});
    else
        next();
}

exports.denyRoutes = function(req, res)
{
    res.status(403).send("");
}

exports.validateSession = function(req,res,next)
{
    if (req.session.user) 
    { 
		next();
	} else {
		res.status(200).send({success:false});
	}
}

exports.login = function(req, res, next)
{
    passport.authenticate("local-login",{session:false},function(err, user, info) {
        if(err || !user)
        {
            return response.json(res,200,{success:false,errorNum: 0,error: err});
        }

        let hash = uuid();

        var tokenInfo = exports.getAcessToken({'data':user,'hash':hash});
        if(!tokenInfo.success)
        {
            return response.json(res,400,{success:false,errorNum: 1,error: err});
        }
        req.session.user = user;
        req.session.hash = hash;
        
        return response.json(res,200,
            {
                success:true,
                data: {
                    id : user._id,
                    token:tokenInfo.token,
                    expireAt : tokenInfo.expiraAt
                }               
            });
    })(req, res, next);
}

exports.logout = function(req, res)
{
    req.session.user = null;
    return response.json(res,200,{success:true});
}

exports.renewAccessToken = function(req, res)
{
    let user = req.session.user;
    if (!user)
        return response.json(res,200,{success:false,errorNum: 99,error: 'invalid user'});

    let user = req.session.user;
    let hash = uuid();

    var tokenInfo = exports.getAcessToken({'data':user,'hash':hash});
    if(!tokenInfo.success)
    {
        return response.json(res,400,{success:false,errorNum: 1,error: err});
    }

    req.session.user = user;
    req.session.hash = hash;

    return response.json(res,200,{ 
        success:true,
        data : {
            id:user._id,
            token:tokenInfo.token,
            expireAt : tokenInfo.expiraAt
        }        
    });
}

exports.getAcessToken = function(user)
{
    let res = {
       success : false,
       token : null,
       expiraAt : 0
    };

    if(!user)
        return res;

    const opts = {
        expiresIn : 43200
    }

    res.success = true;
    res.token = jwt.sign({user},constants.jwt_secret,opts);
    res.expiraAt = opts.expiresIn;

    return res;
}


