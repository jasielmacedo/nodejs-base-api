var mongoose = require('mongoose');
var User = require('../models/user.model');
var UserAnthentication = require('../models/user.authentication.model');
const Debug = require('debug')('recovery');

module.exports = function(acl)
{
    const user = mongoose.model('User');
    user.countDocuments((err, count)=>{
        if(count === 0)
        {
            Debug('MongoDB: No users found');
            Debug('Creating Admin user');
            var newUser = new User();

            newUser.email    = 'admin@base.com';
            newUser.username = "admnistrator";
            newUser.name = 'Administrator';
            newUser.status = 1;

            newUser.save(function(err) {
                if (err)
                    throw err;

                
            });

            var newUserAuth = new UserAnthentication();
            newUserAuth.userId = newUser._id;
            newUserAuth.token = newUserAuth.cryptPassword('123456');
            newUserAuth.type = "local-login";
            newUserAuth.save(function(err) {
                if (err)
                    throw err;
            });

            acl.addUserRoles(newUser._id.toString(),'admin');
            Debug('Admin user added.');     
            Debug(newUser.email + '|123456');         
        }
    });
};