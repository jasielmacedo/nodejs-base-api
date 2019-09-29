var mongoose = require('mongoose');

// ElementType sera usado por diversos elementos que tem apenas o nome
// categoria de games, gamer titles, tags e outros itens que não tem muito mais que o nome, o diferencial sera o modelType

var elementType = mongoose.Schema({
    name : {
        type: String, 
        required: true,
        trim : true,
    },
    modelType : {
        type : String,
        required: true
    },
    status : Number,
}, { timestamps: true });

module.exports = mongoose.model('ElementType',elementType);