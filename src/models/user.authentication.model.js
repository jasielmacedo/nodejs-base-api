var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var uniqueValidator = require('mongoose-unique-validator');

var userAuthenticationSchema = mongoose.Schema({	
	userId: {
		type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        unique: true, 
        index: true
	},	
    token: { type: String, required: true },
    type : String
}, { timestamps: true });

userAuthenticationSchema.plugin(uniqueValidator);


// generate a hash based on the received password
userAuthenticationSchema.methods.cryptPassword = function(password) 
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userAuthenticationSchema.methods.validPassword = function(pwd) 
{
    return bcrypt.compareSync(pwd, this.token);
};

module.exports = mongoose.model('UserAnthentication', userAuthenticationSchema);

