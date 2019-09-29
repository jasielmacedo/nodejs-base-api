let dbname = process.env.DB_NAME || "base";

module.exports = {
    'url' : 'mongodb://localhost:27017/'+dbname // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
};