var LocalStrategy   = require('passport-local').Strategy;
var JwtStrategy   = require('passport-jwt').Strategy;
var ExtractJwt   = require('passport-jwt').ExtractJwt;
var constants = require('./constants');
var User = require('../models/user.model');
var UserAuthentication = require('../models/user.authentication.model');
const Debug = require('debug')('passport');

module.exports = function(passport) 
{
    passport.serializeUser(function(user, done)
    {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = constants.jwt_secret;
    opts.passReqToCallback = true;

    passport.use('jwt-strategy',new JwtStrategy(opts, function(req, jwt_payload, done)
    {
        if(req.session.hash != null && req.session.hash == jwt_payload.user.hash)
        {
            User.findOne(
                { _id : jwt_payload.user.data._id },
                function(err,user)
                {
                    if(err)
                        return done(err, false);

                    if(user)
                    {
                        return done(null, user);
                    }else{
                        return done(null, false);
                    }
                });
        }else{
            done(null,false);
        }
    }));

    passport.use("local-login", new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) 
    {
        User.findOne({
            email : email
        },function(err,user)
        {
            if(err)
                return done(err, false);
                
            if(!user)
                return done("failed to login", false);
    
            if(user.status == 0)
                return done("Your Account Not Activated ,Please Check Your Email", false);
            
            if(user.status == 2)
                return done("Your Account Is blocked, Please contact the administrator for more info.", false);
            
    
            UserAuthentication.findOne({
                userId : user._id
            },function(uaErr,userAuth)
            {
                if(uaErr)
                    return done(uaErr, false);
    
                if(!userAuth)
                    return done("failed to login. Method of authentiation is missing", false);
    
                if(userAuth.type != "local-login")
                    return done("failed to login.", false);
    
                if(!userAuth.validPassword(password))
                    return done("failed to login.", false);

                req.session.user = user;
                return done(null, user);
            });
        });   
    }));
}