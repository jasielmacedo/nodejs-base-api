var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
    name : String,
    email : { type: String, unique: true, index: true, required: true },
    status : Number,
    activationCode : { type: String },
    info : {
        taxvat : { type : String, index: true},
        gender : {
            type : String,
            enum : ['M','F','L','G','B','T','Q','NA'],
            default : 'NA'
        },
        dateBirth : { type : Date },
        acceptNews : Number,
        acceptSms : Number,
        gamertag : [
            {
                tag : String,
                platform : String,
            }
        ]
    },
    xp : {
        currentLevel : Number,
        currentXp : Number,
        gamerTitle : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'ElementType',
            index : true
        }
    }
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);