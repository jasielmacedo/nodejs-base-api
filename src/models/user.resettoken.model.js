var mongoose = require('mongoose');

var userResetToken = mongoose.Schema({
    userId: {
		type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
        index : true
	},	
    token: { type: String, required: true },
    status : Number,
}, { timestamps: true });

module.exports = mongoose.model('UserResetToken',userResetToken);